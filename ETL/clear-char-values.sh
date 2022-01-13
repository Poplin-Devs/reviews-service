#!/bin/sh

# Author : Andrew Carnero
# -----------------------

echo "Are you sure you want to clear char_reviews? If so, enter the DB pass."
read -s DB_PASS

mysql --user=root --password=$DB_PASS reviews_service << EOF
DELETE FROM char_reviews;
SELECT * FROM char_reviews;
EOF

echo 'char_reviews has been cleared of data.'