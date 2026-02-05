@echo off
echo Proje Sunucusu Baslatiliyor...
echo.
echo Lutfen tarayicinizin adres satirina su adresi yazip girin: http://127.0.0.1:8080
echo (Tarayici otomatik acilmazsa manuel olarak gidin)
echo.
start http://127.0.0.1:8080
npx http-server -o -c-1
pause
