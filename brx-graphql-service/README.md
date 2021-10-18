# brX GraphQL Service
Documentation can be found here https://documentation.bloomreach.com/14/library/solutions/commerce-starterstore/graphql-service/introduction.html
## Get started

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run start
```

Get an access token:

```bash
curl -i -d '{}' -H 'Content-Type: application/json' -H 'connector: sap' http://localhost:4000/signin
```

```bash
curl -i -d '{}' -H 'Content-Type: application/json' -H 'connector: brsm' http://localhost:4000/signin
```

Example response to above:

```bash
HTTP/1.1 200 OK
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Server: brx-graphql-service-app:0.0.1 / v14.5.1 v15.14.0 darwin x64
Content-Type: application/json; charset=utf-8
Content-Length: 520
ETag: W/"208-APfLV+K9TBGviae81oshS4U64WQ"
Date: Wed, 14 Apr 2021 10:21:39 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"authorization":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiQTI1NktXIiwia2lkIjoiQVZXTS14YkZ1aWxQODlGWEZnZUVUN3gtV01TVHNiQnpwVEV1NVZmTlhHSSJ9.UkepipExGe-qpLdIPZeo6hBYQB2Uenxy3qSIDwNvsYam9MczN0z9Hw.VM31jViLtfSz91bRQt2U6g.sRQD-TSRLrEHxNW4l3Vvsu6TPhoOCUy9mK8eaNDF3USexmDBn6TWEQmAN6deeLn_6CxWeBU-0MH5FToEmB4mapOohzEHMKw387LVCYwIqf2KdRS1NuBSq4zkhlXV5WCtdbK-maIIkUYr78_wP9mYMHlpxa4dBDT4kypgX9BD1VK4Aayh3cldqMusNtBBnfgA_oISEzTQC1xjGCWgITyL_zsL0Bt1LISqMAgM7cHjnRG2n3n5XqylPZQ6SvmTdtexClSXUE99W-oNqOKaETSKYQ.hZUPKKsIx4zV3uWw1jx8IA"}%
```

Grab the authorization bit and visit http://localhost:4000/graphql

Modify the "http headers" section below. (Click if it's collapsed). An example would be:

```json
{
  "connector": "sap",
  "authorization": "Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiQTI1NktXIiwia2lkIjoiQVZXTS14YkZ1aWxQODlGWEZnZUVUN3gtV01TVHNiQnpwVEV1NVZmTlhHSSJ9.UkepipExGe-qpLdIPZeo6hBYQB2Uenxy3qSIDwNvsYam9MczN0z9Hw.VM31jViLtfSz91bRQt2U6g.sRQD-TSRLrEHxNW4l3Vvsu6TPhoOCUy9mK8eaNDF3USexmDBn6TWEQmAN6deeLn_6CxWeBU-0MH5FToEmB4mapOohzEHMKw387LVCYwIqf2KdRS1NuBSq4zkhlXV5WCtdbK-maIIkUYr78_wP9mYMHlpxa4dBDT4kypgX9BD1VK4Aayh3cldqMusNtBBnfgA_oISEzTQC1xjGCWgITyL_zsL0Bt1LISqMAgM7cHjnRG2n3n5XqylPZQ6SvmTdtexClSXUE99W-oNqOKaETSKYQ.hZUPKKsIx4zV3uWw1jx8IA"
}
```
Note that above we use the authorization token we grabbed from the previous curl command.

## Query Examples

### findItemsByKeyword
```graphql
query {
  findItemsByKeyword(text: "bed"){
    offset
    limit
    count
    total
    items{
      itemId {
         id
         code
      }
      displayName
      description
      imageSet {
        original {
          link {
            href
          }
        }
        thumbnail{
          link {
            href
          }
        }
      }
    }
  }
}
```
Response (note the itemId section. We'll use id and code together in the next query):

```json
{
  "data": {
    "findItemsByKeyword": {
      "offset": 0,
      "limit": 10,
      "count": 10,
      "total": 530,
      "items": [
        {
          "itemId": {
            "id": "ASH9264",
            "code": "ASH9264"
          },
          "displayName": "White Loft Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WhiteLoftBed_ASH9264_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WhiteLoftBed_ASH9264_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9288",
            "code": "ASH9288"
          },
          "displayName": "Allium Stonington Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedAllium_ASH9288_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedAllium_ASH9288_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9289",
            "code": "ASH9289"
          },
          "displayName": "Bellwood Stonington Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedBellwood_ASH9289_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedBellwood_ASH9289_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9290",
            "code": "ASH9290"
          },
          "displayName": "Cerro Stonington Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedCerro_ASH9290_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/StoningtonBedCerro_ASH9290_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9518",
            "code": "ASH9518"
          },
          "displayName": "White Langston Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LangstonBedWhite_ASH9518_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LangstonBedWhite_ASH9518_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9261",
            "code": "ASH9261"
          },
          "displayName": "Cerro Loft Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LoftBedCerro_ASH9261_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LoftBedCerro_ASH9261_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9265",
            "code": "ASH9265"
          },
          "displayName": "Allium Westport Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedAllium_ASH9265_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedAllium_ASH9265_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9266",
            "code": "ASH9266"
          },
          "displayName": "Bellwood Westport Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedBellwood_ASH9266_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedBellwood_ASH9266_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9267",
            "code": "ASH9267"
          },
          "displayName": "Cerro Westport Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedCerro_ASH9267_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/WestportBedCerro_ASH9267_product_list?$Coordinates$"
              }
            }
          }
        },
        {
          "itemId": {
            "id": "ASH9486",
            "code": "ASH9486"
          },
          "displayName": "Cerro Langston Bed",
          "description": "",
          "imageSet": {
            "original": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LangstonBedCerro_ASH9486_product_list?$Listing$"
              }
            },
            "thumbnail": {
              "link": {
                "href": "https://api.ckysk-freshamer1-d1-public.model-t.cc.commerce.ondemand.com/annieselkews/v2https://annieselke.scene7.com/is/image/FreshAmerican/LangstonBedCerro_ASH9486_product_list?$Coordinates$"
              }
            }
          }
        }
      ]
    }
  }
}
```

### findItemById
The id in the query has the form: <id>___<code> . For id and code see the above query.
```graphql
query {
  findItemById(id: "ASH9267___ASH9267") {
      itemId {
         id
         code
      }
      displayName
      description
      imageSet {
        original {
          link {
            href
          }
        }
        thumbnail{
          link {
            href
          }
        }
      }
    }
}
```



