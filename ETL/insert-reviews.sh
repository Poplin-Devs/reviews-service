#!/bin/sh

# Author : Andrew Carnero
# -----------------------

touch record-errors.txt

INPUT=data/reviews-1.csv
CURRENT_LINE=1
TOTAL_LINES=500000

[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }

while IFS=',' read id product_id rating date summary body recommend reported reviewer_name reviewer_email response helpfulness
do

mysql --login-path=local reviews << sqlQueries
INSERT INTO reviews (\`review_id\`,\`product_id\`, \`rating\`, \`date\`, \`summary\`, \`body\`, \`recommend\`, \`reported\`, \`reviewer_id\`, \`response\`, \`helpfulness\`)
	VALUES ($id,$product_id, $rating, $date, '$summary', '$body', $recommend, $reported, '$reviwer_name', $response, $helpfulness);
sqlQueries

let "CURRENT_LINE++"
echo "$CURRENT_LINE / $TOTAL_LINES"

done < $INPUT

echo "SCRIPT COMPLETE."

