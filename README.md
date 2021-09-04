<h1>GraphQl</h1>
<h3>Run the app</h3>
<p>You can simply run the app via command <b>nodemon app.js</b> after running <b>npm install</b></p>
<h3>Notes:</h3>
<ul>
<li> all queries and mutations are public <b>except</b> <b>createProduct</b> mutation . so you have to send Authorization header when applying it</li>
<li> in <b>getProducts</b> query , to filter by product price, you have to send "priceOrder" as an argument with value DESC OR ASC </li>
<li> in <b>getProducts</b> query , to filter by seller , you have to send "seller" as an argument with value of seller id </li>

</ul>