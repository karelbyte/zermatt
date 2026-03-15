# Proyecto Zermatt

Este repositorio contiene el código fuente del proyecto Zermatt.

## Uso

En un entorno de alojamiento compartido, para ejecutar migraciones de la base de datos con la versión PHP 8.4 se puede usar el siguiente comando:

```
/usr/local/bin/ea-php84 artisan migrate 
```

Esto asegura que `artisan` se ejecute con PHP 8.4 en el host compartido.

<IfModule mime_module>
  AddHandler application/x-httpd-ea-php84 .php .php8 .phtml
</IfModule>