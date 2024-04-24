Configuration for our mysql database!

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