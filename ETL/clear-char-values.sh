#!/bin/sh

# Author : Andrew Carnero
# -----------------------

echo "Are you sure you want to clear char_values? If so, enter the DB pass."
read -s DB_PASS

mysql --user=root --password=$DB_PASS reviews_service << EOF
DELETE FROM char_values;
SELECT * FROM char_values;
EOF

echo 'char_values has been cleared of data.'