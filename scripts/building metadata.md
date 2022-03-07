# this lines allow to build a metadata table from GISAID metadata and to correct them using  virusseq-dataportal

#Report the date of the GISAID metadata downloaded in the Rnotebook
date=2022_03_04
#this key come from the file downloaded on virusseq-dataportal.ca
filefromVirusSeq=c6440a4c-5690-408a-ba5f-d10f95e47a91

#extract and reformat the metadatas from GISAID
tar -axf metadata_tsv_$date.tar.xz metadata.tsv -O | tr ' ' '_'  | sed 's/\t\t/\tNA\t/g' | sed 's/\t\t/\tNA\t/g' | sed 's/\t$/\tNA/g' | awk 'NR==1 || substr($1,9,6)=="Canada" && $8=="Human"' | sort -k3,3 > metadata_CANall_$date.uncorrected.csv 

#extract and reformat the metadatas virusseq-dataportal
tar -axf $filefromVirusSeq -O  files-archive-$filefromVirusSeq.tsv | tr ' ' '_'  | sed 's/\t\t/\tNA\t/g' | sed 's/\t\t/\tNA\t/g' | sed 's/\t$/\tNA/g' | awk 'NR!=1 && $43!="NA"' | cut -f5,43 | sort -k2,2 | uniq > epidatesfromvirrusseq_$date

#remove the lines with duplicate GISAID ids
join <(cut -f2 epidatesfromvirrusseq_$date  | sort | uniq -c | awk '$1!=1{print $2,"toremove"}' ) -a2 -2 2 epidatesfromvirrusseq_$date | grep -v toremove | tr ' ' '\t'  > temp
mv temp epidatesfromvirrusseq_$date

#join both files and replace sample dates from GISAID that are in virusseq-dataportal
join -1 3 metadata_CANall_$date.uncorrected.csv -a 1 -2 1 epidatesfromvirrusseq_$date | awk '$4!=$23 && length($4)<10 && length($23)==10{$4=$23} {id=$1;$1=$2;$2=$3;$3=id} {print}' | tr ' ' '\t'| cut -f-22 > metadata_CANall_$date.csv

#this zip have to be placed in data_needed
zip metadata_CANall_last.zip metadata_CANall_$date.csv
