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

## generate an error text file named 'records-with-errors'
## instantiate an insert counter variable at 0
##
## read the CSV file
## instantiate a total number of lines variable
##
## for each line:
##    for each line, ensure each value data type to be inserted is of the correct type
##      if there is a data type error,
##        add all the values in csv format to the text file, then move on
##      otherwise,
##        insert it into the mySQL database table char_values
##        increase insert counter variable
## echo a final complete message with the number of successful inserts and the number of errors