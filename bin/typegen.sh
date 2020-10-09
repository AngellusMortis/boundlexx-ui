#!/bin/bash

echo "/* eslint-disable */" > /app/boundlexx-ui/src/api/client.d.ts
/app/node_modules/.bin/typegen $1 >> /app/boundlexx-ui/src/api/client.d.ts
