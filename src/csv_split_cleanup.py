import csv
import os
import sys
from datetime import datetime
from io import StringIO


def process_splits(csv_text: str) -> str:
    reader = csv.reader(StringIO(csv_text))
    headers = next(reader)
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)

    # Add the information transaction
    info_transaction = {
        'postedOn': datetime.now().strftime('%-m/%-d/%Y'),
        'state': 'INFO',
        'category': 'SPLIT',
        'amount': '$0.00',
        'notes': 'Updated ' + datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S%z'),
        'payee': 'Distribute SPLIT fields from parent to children.'
    }
    writer.writerow([info_transaction.get(header, '') for header in headers])

    parent_split_record = None

    # Account for header line
    for line_number, row in enumerate(reader, start=2):
        record = dict(zip(headers, row))

        if record['category'] == 'SPLIT':
            parent_split_record = record.copy()
            writer.writerow(row)

        elif not record['account'] and not record['postedOn']:
            if not parent_split_record:
                raise ValueError(f"Error at line {line_number}: Found a child SPLIT before a parent SPLIT record. Record: {record}")
            if not record['category'] or not record['amount']:
                raise ValueError(f"Error at line {line_number}: Child SPLIT record is missing 'category' or 'amount'. Record: {record}")

            for key in headers:
                if not record[key]:
                    record[key] = parent_split_record.get(key, '')
            writer.writerow([record[key] for key in headers])

        else:
            parent_split_record = None
            writer.writerow(row)

    return output.getvalue()


def transform_filename(input_filename: str) -> str:
    base, ext = os.path.splitext(input_filename)
    return f"{base}_cleaned{ext}"


if __name__ == "__main__":
    if len(sys.argv) == 1:
        input_text = sys.stdin.read()
        try:
            output_text = process_splits(input_text)
            sys.stdout.write(output_text)
        except ValueError as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.exit(1)
    elif len(sys.argv) == 2:
        input_filename = sys.argv[1]
        output_filename = transform_filename(input_filename)
        try:
            with open(input_filename, 'r', encoding='utf-8') as infile:
                input_text = infile.read()
            output_text = process_splits(input_text)
            with open(output_filename, 'w', encoding='utf-8') as outfile:
                outfile.write(output_text)
        except Exception as e:
            sys.stderr.write(f"Error: {str(e)}\n")
            sys.exit(1)
    else:
        sys.stderr.write("Usage: python script.py [input_filename]\n")
        sys.exit(1)
