#!/bin/sh

# Author : Andrew Carnero
# -----------------------

touch record-errors.txt

INPUT=results/reviews-1.csv
INSERT_COUNT=0
CURRENT_LINE=1
#TOTAL_LINES=5777922
TOTAL_LINES=500000

[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }

while IFS=',' read id product_id rating date summary body recommend reported reviewer_name reviewer_email response helpfulness
do
  ERROR=false
	SUMMARY_LENGTH=${#summary}
	BODY_LENGTH=${#body}

	##echo "$CURRENT_LINE: summ $SUMMARY_LENGTH, body $BODY_LENGTH"

	if [[ ! -z $id && ! -z $product_id && ! -z $rating && ! -z $date && ! -z $summary
	&& ! -z $body && ! -z $recommend && ! -z $reported && ! -z $reviewer_name
	&& ! -z $reviewer_email && ! -z $helpfulness ]] &&
	[[ $id =~ ^[0-9]+$ && $product_id =~ ^[0-9]+$ && $rating =~ ^[0-9]+$ && $recommend =~ ^[0-9]+$ && $reported =~ ^[0-9]+$ ]] &&
	[[ $SUMMARY_LENGTH -lt 100 && $BODY_LENGTH -lt 1000 ]]; then
		let "INSERT_COUNT++"

##if [[ $CURRENT_LINE -gt 1 ]] ; then
# mysql --login-path=local reviews << sqlQueries
# INSERT INTO reviews (\`review_id\`,\`product_id\`, \`rating\`, \`date\`, \`summary\`, \`body\`, \`recommend\`, \`reported\`, \`reviewer_id\`, \`response\`, \`helpfulness\`)
# 	VALUES ($id,$product_id, $rating, $date, '$summary', '$body', $recommend, $reported, '$reviwer_name', $response, $helpfulness);
# sqlQueries
#fi

  else
	  echo "$id," >> record-errors.txt
	fi

  let "CURRENT_LINE++"
	echo "$INSERT_COUNT / $TOTAL_LINES"

done < $INPUT

let "CURRENT_LINE--"

echo "SCRIPT COMPLETE. $INSERT_COUNT out of $CURRENT_LINE records inserted into the database."

