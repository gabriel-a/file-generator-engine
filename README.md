# Carbone Docker
Embedded Carbone in a Docker image with simple REST API.

## How to consume exposed API ?
The Simplest way to use this image is to use `node` .

## From carbone.io website
_Fast, Simple and Powerful report generator in any format PDF, DOCX, XLSX, ODT, PPTX, ODS [, ...]_

_... using your JSON data as input._

See [carbone.io website](https://carbone.io) for full **Carbone** documentation.
See [carbone github](https://github.com/carboneio/carbone) for full **Carbone** documentation.

## Docker build
### Make sure to build libre_office docker first
docker build -t my-file-generator .
docker run -p 3030:3030 --name my-file-generator my-file-generator

### Simple JSON example with template format docx and output PDF
```
curl -o test.pdf --location --request POST 'http://localhost:3030/render' \
--form 'format="pdf"' \
--form 'outputName="test.pdf"' \
--form 'data="{\"firstname\":\"John\", \"lastname\": \"Doe\"}"' \
--form 'template=@"examples/sample.docx"'
```

### Example with list of data with template format docx and output PDF
```
curl -o movies.pdf --location --request POST 'http://localhost:3030/render' \
--form 'format="pdf"' \
--form 'outputName="movies.pdf"' \
--form 'data="[
  {
    \"movieName\": \"Matrix\",
    \"actors\": [
      {
        \"firstname\": \"Keanu\",
        \"lastname\": \"Reeves\"
      },
      {
        \"firstname\": \"Laurence\",
        \"lastname\": \"Fishburne\"
      },
      {
        \"firstname\": \"Carrie-Anne\",
        \"lastname\": \"Moss\"
      }
    ]
  },
  {
    \"movieName\": \"Back To The Future\",
    \"actors\": [
      {
        \"firstname\": \"Michael\",
        \"lastname\": \"J. Fox\"
      },
      {
        \"firstname\": \"Christopher\",
        \"lastname\": \"Lloyd\"
      }
    ]
  }
]"' \
--form 'template=@"examples/movies.docx"'
```

### Example with list of data with template format ods and output xls
```
curl -o table.xls --location --request POST 'http://localhost:3030/render' \
--form 'format="xls"' \
--form 'outputName="table.xls"' \
--form 'data="[
  {
    \"movieName\": \"Matrix\",
    \"actors\": [
      {
        \"firstname\": \"Keanu\",
        \"lastname\": \"Reeves\"
      },
      {
        \"firstname\": \"Laurence\",
        \"lastname\": \"Fishburne\"
      },
      {
        \"firstname\": \"Carrie-Anne\",
        \"lastname\": \"Moss\"
      }
    ]
  },
  {
    \"movieName\": \"Back To The Future\",
    \"actors\": [
      {
        \"firstname\": \"Michael\",
        \"lastname\": \"J. Fox\"
      },
      {
        \"firstname\": \"Christopher\",
        \"lastname\": \"Lloyd\"
      }
    ]
  }
]"' \
--form 'template=@"examples/flat_table.ods"'
```