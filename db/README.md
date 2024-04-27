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

3. If you want to change the database table name, do so in `~/compose.yaml
See the `DATABASE_DB` value.

4. Install dependencies:
- `mysql`
```shell
pip install mysql-connector
```
- `lxml`
```
pip install lxml
```

## Ready to Run!
(find the inner directory with `setup_sql.py` then run it!)

```shell
$ python install setup_sql.py
```

## Dummy data
`Miniature database code/*` currently pulls 100 entries from our dataset to construct the database.
- this is just the first 100 entries from the dataset.
- **Runtime**: ~5 min
- In case the branch you are reading this on isn't working, you should be able to find working code with this runtime and context at this branch:
    - https://github.com/UMBC-CMSC461-SP2024/project-discodb/tree/python-100-dummy-construct-5-minutes-april-24
- @LT69018 Todo: use mySQL username / password (set global :0)

## Our tailored small dataset.
To see most up to date version of this code, check Coby's branch:
https://github.com/UMBC-CMSC461-SP2024/project-discodb/tree/Coby's_database_code/db
- he is working on targeting relevant artists (from our group members preferences) 
- **Runtime**: ~30 min (the price we pay for interesting data.)

## Error codes
- `-1` means stop the program running, it ain't gonna work
- Not -1 i.e. (`0`) means it's good 

View it in the docker container by following instructions like these.

# Viewing the database (Docker MySQL image - Shell Commands)
I recommend verifying if database transactions are taking place by looking at a shell in the container.
```shell
docker exec -it project-discodb-db-1 bash
```

## Alternative option - use MySQL Desktop
Alternatively you can use `MySQL` desktop and provide the following info:
- Host: localhost (i.e. 127.0.0.1)
- Port: 3306
- Username: root
- Password: (see password.txt)



## 1. Find the password. 
- Currently the password is in `./password.txt`
- If that doesn't exist, it may have been auto-generated...
- If auto generated you have to do this in a linux shell.
    ```
    docker logs project-discodb-db-1 2>&1 | grep GENERATED
    ```
## 2. Run this `docker exec` command. Enter password when prompted.
```shell
docker exec -it myproject-discodb-db-1 mysql -uroot -p
```
Reference: https://dev.mysql.com/doc/mysql-linuxunix-excerpt/8.3/en/docker-mysql-getting-started.html

Example appearance on Windows powershell.
```ps
PS C:\...\jturn>docker exec -it project-discodb-db-1 mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 8.0.27 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

## 3. Enjoy the fruits of your labor!
This should bring you to a mySQL terminal :)

- P.S. I recommend using these commands / flags to make printing the tables look nice. 
    - `\G` flag (draw lines between each row in case they wrap around) i.e. `SELECT 1 \G`
    - (NON-WINDOWS ONLY) 
    ```sql
    mysql> pager less -SFX
    mysql> SELECT * FROM sometable;
    ```
    - ^ Reference: https://techtldr.com/my-sql-pretty-print-in-command-line/

- General Commands

```sql
mysql> SHOW DATABASES;
+------------------------+
| Database               |
+------------------------+
| discodb                |
| discodb_mini_top_100   |
| example                |
| information_schema     |
| mysql                  |
| performance_schema     |
| sys                    |
+------------------------+
9 rows in set (0.00 sec)

mysql> USE discodb_mini_top_100;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> SHOW TABLES;
+--------------------------------+
| Tables_in_discodb_mini_top_100 |
+--------------------------------+
| albums                         |
| artist_album_credits           |
| artist_aliases                 |
| artists                        |
| band_membership                |
| genres                         |
| name_variations                |
| songs                          |
| videos                         |
+--------------------------------+
9 rows in set (0.01 sec)
```

