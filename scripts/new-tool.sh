#!/bin/bash
# Usage: ./scripts/new-tool.sh "Tool Name" "tool-slug"

TOOL_NAME=$1
TOOL_SLUG=$2

if [ -z "$TOOL_NAME" ] || [ -z "$TOOL_SLUG" ]; then
  echo "Usage: ./scripts/new-tool.sh \"Tool Name\" \"tool-slug\""
  echo "Example: ./scripts/new-tool.sh \"Whois Lookup\" \"whois-lookup\""
  exit 1
fi

echo "🛠️  Creating new tool: $TOOL_NAME ($TOOL_SLUG)"

# Create folders
mkdir -p backend/src/modules/$TOOL_SLUG
mkdir -p frontend/src/pages/tools

echo "✅ Tool scaffold created!"
echo "📁 Ready for implementation"
