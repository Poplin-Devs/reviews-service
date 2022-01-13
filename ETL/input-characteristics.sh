#!/bin/sh

# Author : Andrew Carnero
# -----------------------

echo "Please enter the database password"
read -s DB_PASS

CHAR_ID='1'
VALUE=4
echo 'some text'
echo ''
echo $CHAR_ID
echo $VALUE

mysql --user=root --password=$DB_PASS reviews_service << sqlQueries
INSERT INTO char_values (\`characteristic_id\`,\`value\`) VALUES ('$CHAR_ID','$VALUE');
sqlQueries


## INSERT INTO `char_values` (`characteristic_id`,`value`) VALUES ("CHAR_ID","VALUE");

echo 'Insert complete'
