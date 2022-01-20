# **reviews-service**

This repository is the reviews and rating API for Atelier's new back end system.

The reviews service is designed using a an Express server and a mySQL database.

<div align="center">

[reviews API](#reviews-api) |
[data model](#data-model) |
[ETL process](#etl-process) |
[technologies](#dependencies) |
[project journal](#project-journal)

</div>

# **reviews API**

The shape of result data was to maintain the  shape of data as was originally returned in the previous API.

The API is outlined below:

> ### **List Reviews**
>`GET /reviews`
>| Parameter | Type | Description |
>|:---------:|:----:|:-----------:|
>| page | integer | Selects the page of results >to return. Default 1. |
>|count|integer|Specifies how many results per >page to return. Default 5.|
>|sort|text|Changes the sort order of reviews to >be based on "newest", "helpful", or "relevant"|
>|product_id|integer|Specifies the product for which to retrieve reviews.|

>`Response: 200 OK`

```
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
```

# **data model**

final version: 4.0, 1/17/22

![Data Model version 4](./data_models/sql-modelv4.png)

Version History
- [v 3.0][version2] 1/12/22
- [v 2.0][version2] 1/11/22
- [v 1.0][version1] 1/10/22

[version3]: ./data_models/sql-modelv3.png
[version2]: ./data_models/sql-modelv2.png
[version1]: ./data_models/sql-modelv1.png

# **ETL process**

After building the new back end architecture, existing data had to be migrated over.

A custom-built extract, transform, load process was built first using only Bash scripts and then additionally using node. The process was unacceptably slow at the beginning, but after a few iterations and optimization, an acceptable ingestion rate was achieved.

### **version 1: Bash**

- Bash was used to extract, validate, and insert data into the mySQL database.
- [Insert Data Points] First load rate was 18 records inserted per second (12 fields)

### **version 2: node/JS**

- Bash was a fine solution to split up the .CSV files by line but beyond that, required too much time to build and optimize.
- node.js (native modules: filesystem, readline, and npm module mysql2) was used to create a read stream to build bulk mySQL queries. Inserting 5,000 values per query was quick to transform and quick to load.
- [Insert Data Points] Final load rate was 36k records inserted per second (12 fields)

# **db & server performance tuning**

The Reviews service utilizes 12 queries to obtain response data for all of the request endpoints.
- In their first iteration, two read queries, naturally the most complex queries, were majorly problematic: `GET /reviews` and `GET /reviews/meta`.
- Respectively, these queries took, on average, 5.2 and 5.7 seconds to complete.
- After indexing selected columns in certain tables, these queries, along with all other queries in the service, respond on average within 1 second.
- Data from the query tests before and after indexing changes is displayed below:

![Local query performance metrics data](./metrics/local-query-perf-tuning-metrics.png)

# **technologies**

- built using node.js
  - node modules: filesystem, readline, mysql2
- mysql CLI
- server built with Express

> TO UPDATE:
- Deployed using AWS EC2
- Docker

# **project journal**

You can read a daily record of engineering notes for this project [here](https://vagabond-papaya-2c5.notion.site/36e2556afa6849c488e6ff99cf762ab5?v=c6bd8b96f66a4c37b43d2ee8c08bfc5f).
