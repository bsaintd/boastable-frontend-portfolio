npm run build
sed '/dist/d' .gitignore
mkdir dist/reset-password
mkdir dist/swipe
cp dist/index.html dist/404.html
cp dist/index.html dist/reset-password/index.html
cp dist/index.html dist/swipe/index.html
echo 'app.boastable.co' > dist/CNAME
git add .
git commit -m "dist"
git branch -D gh-pages
git subtree split --branch gh-pages --prefix dist
rm -r dist
echo 'dist' >> .gitignore
git add .
git commit -m "clear dist"
