var express = require('express');
var elasticsearch = require('elasticsearch');
var bodyParser = require('body-parser');

var client = elasticsearch.Client({
		host:'localhost:9200'
	});

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname +  '/public'));

function addBlog(document){
	console.log(document);
	return client.index({
		index:'blogs',
		type:'blog',
		body:document
	});
}
function getBlogs(){
	console.log('searching blogs');
	return client.search({
		index: 'blogs',
		type:'blog',
		body :{
			query:{
				 "query_string" : {
				        "query" : "*"
				    }
			}
		}
	});
}

app.get('/api/blog',function(req,res){
	getBlogs().then(function(result){
		json_res = Array();
		result.hits.hits.forEach(function(item,index,arr){
			json_res.push(item._source);
		});

		res.json(json_res)
	});	
});


app.post('/api/blog',function(req,res){
	addBlog(req.body).then(function(result){
		res.json(result);
	})
});

var port = 3000;

app.listen(port);

console.log('server on ' + port);