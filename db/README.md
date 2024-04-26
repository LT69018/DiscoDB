Configuration for our mysql database!

# Code to construct the database
**Note:** Try to shut off miscellaneous processes that take up a lot of RAM to make this take less time :<)

## Before you run anything! (Note from Jess)
1. As stated in `~/README.md`, you must download the dataset files. Note the final paths of each of these files
2. Check out `config.py`. This is where you can specify...
- the folder that you downloaded/moved those `*.xml` files to.
- the file names if you changed them.
- To my dearest collabrators, please don't over-write this! 
    - If you want to use a local version of mysql server...
    - you can change the constants in this file. 
    - Also note my comment on the top of `setup_sql.py/connect_to_server`
3. Install dependencies:
- `mysql`
```shell
pip install mysql-connector
```
- `lxml`
```
pip install lxml
```
## Dummy data
`Miniature database code/*` currently pulls 100 entries from our dataset to construct the database.
- this is just the first 100 entries from the dataset.

To see most up to date version of this code, check Coby's branch:
https://github.com/UMBC-CMSC461-SP2024/project-discodb/tree/Coby's_database_code/db
- he is working on targeting relevant artists (from our group members preferences) 

View it in the docker container by following instructions like these.
If you do not have docker desktop, start a shell in the container by doing
```shell
docker exec -it project-discodb-db-1 bash
```
Alternatively to get right into the mysql shell...

1. Find the password. 
- If auto generated you have to do this in a linux shell.
    ```
    docker logs project-discodb-db-1 2>&1 | grep GENERATED
    ```
```shell
docker exec -it myproject-discodb-db-1 mysql -uroot -p
```
- Enter either the password from running that command to get the password. 
- Currently the password is in `./password.txt`
Reference: https://dev.mysql.com/doc/mysql-linuxunix-excerpt/8.3/en/docker-mysql-getting-started.html


# Shell Commands to view Database
```shell
ls /var/lib/mysql
```