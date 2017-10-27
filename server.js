
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const blogRouter = require('./blogRouter');
const {BlogPosts} = require('./models');

BlogPosts.create('Blog 1', 'This is the first blog', 'John Smith', 'October 25');
BlogPosts.create('Blog 2', 'This is the second blog', 'Jack Smith', 'October 26');
BlogPosts.create('Blog 3', 'This is the third blog', 'Jordan Smith', 'October 27');
BlogPosts.create('Blog 4', 'This is the fourth blog', 'Jason Smith', 'October 28');


// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});


app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  res.status(204).end();
})

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  // console.log(req.body.title);
  // console.log(req.body.content);
  // console.log(req.body.author);
  // console.log(req.body.publishDate);
  BlogPosts.update({
  id: req.params.id,
  title: req.body.title,
  content: req.body.content,
  author: req.body.author,
  publishDate: req.body.publishDate
  });
  res.status(204).end();
})

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

app.use('/', blogRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
