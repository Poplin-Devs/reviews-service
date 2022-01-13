#!/bin/sh

# Author : Andrew Carnero
# -----------------------

echo "Please enter the database password"
##read -s DB_PASS

DB_PASS='zYvwFC0TkYzoFeXbEG7S'

touch record-errors.txt

INPUT=data/s-characteristic_reviews.csv
INSERT_COUNT=0
CURRENT_LINE=1

OLDIFS=$IFS
IFS=','

[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }

sp="/-\|"
sc=0
spin() {
   printf "\b${sp:sc++:1}"
   ((sc==${#sp})) && sc=0
}
endspin() {
   printf "\r%s\n" "$@"
}

while read id char_id review_id value
do
	#spin

	ERROR=false

	# case $id in
  #   ''|*[!0-9]*)
	# 	  ERROR=true
	# 		echo "$CURRENT_LINE: id contains missing or wrong value type." >> record-errors.txt
	# 		;;
  #   *)  ;;
	# esac

	# case $char_id in
  #   ''|*[!0-9]*)
	# 		ERROR=true
	# 		echo "$CURRENT_LINE: char_id contains missing or wrong value type." >> record-errors.txt
	# 		;;
  #   *)  ;;
	# esac

	# case $review_id in
  #   ''|*[!0-9]*)
	# 		ERROR=true
	# 		echo "$CURRENT_LINE: review_id contains missing or wrong value type." >> record-errors.txt
	# 		;;
  #   *)  ;;
	# esac

	# case $value in
  #   ''|*[!0-9]*)
	# 		ERROR=true
	# 		echo "$CURRENT_LINE: value contains missing or wrong value type." >> record-errors.txt
	# 		;;
  #   *)  ;;
	# esac

	if [[ $ERROR == false ]] ; then
  mysql --user=root --password=$DB_PASS reviews << sqlQueries
  INSERT INTO char_reviews (\`id\`,\`char_id\`, \`review_id\`, \`value\`)
	  VALUES ('$id','$char_id', '$review_id', '$value');
	Select * from char_reviews;
sqlQueries
	fi

  let "CURRENT_LINE++"

done < $INPUT
IFS=$OLDIFS

endspin

echo $CURRENT_LINE

# echo "Please enter the database password"
# read -s DB_PASS

# CHAR_ID='1'
# VALUE=4
# echo 'some text'
# echo ''
# echo $CHAR_ID
# echo $VALUE

# mysql --user=root --password=$DB_PASS reviews_service << sqlQueries
# INSERT INTO char_values (\`characteristic_id\`,\`value\`) VALUES ('$CHAR_ID','$VALUE');
# sqlQueries


## INSERT INTO `char_values` (`characteristic_id`,`value`) VALUES ("CHAR_ID","VALUE");

echo 'Insert complete'

## generate an error text file named 'records-with-errors'
##
## read the CSV file
## instantiate a total number of lines variable
## instantiate an insert counter variable at 0
##
## for each line:
##    for each line, ensure each value data type to be inserted is of the correct type
##      if there is a data type error,
##        add all the values in csv format to the text file, then move on
##      otherwise,
##        insert it into the mySQL database table char_values
##        increase insert counter variable
## echo a final complete message with the number of successful inserts and the number of errors