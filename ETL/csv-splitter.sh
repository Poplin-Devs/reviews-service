#!/bin/sh

# Author : Andrew Carnero
# -----------------------

#Enter the source file
INPUT=data/reviews.csv
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }

#Enter the Range
RANGE=100000

START=2
END=$[RANGE+1]
TOTAL_LINES=$(wc -l < $INPUT)
EXT=1

while [ $END -lt $[$TOTAL_LINES + $RANGE] ]
do
echo $START, $END, $EXT, $TOTAL_LINES
sed -n "$START,$END p;$END q" $INPUT > results/reviews-$EXT.csv
START=$[$START+$RANGE]
END=$[$START+$RANGE-1]
EXT=$[$EXT+1]
done

echo "File split complete."
