const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should get all blog posts on GET', function() {
    // return chai.request(server)
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
        console.log('everything passed');
      });
  });

  it('should add an item on POST', function() {
      const newItem = {
    "id": "fc7e9fe6-d90b-4b5a-ba47-3518a7699e2b",
    "title": "Blog new",
    "content": "This is the second blog",
    "author": "Jack Smith",
    "publishDate": "October 26"
};
      return chai.request(app)
        .post('/blog-posts')
        .send(newItem)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
          res.body.id.should.not.be.null;
          // response should be deep equal to `newItem` from above if we assign
          // `id` to it from `res.body.id`
          res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });
    });

    it('should delete items on DELETE', function() {
  return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      return chai.request(app)
      .delete(`/blog-posts/${res.body[0].id}`);
    })
    .then(function(res) {
      res.should.have.status(204);
    });
});

it('should update blog posts on PUT', function() {

  return chai.request(app)
    // first have to get
    .get('/blog-posts')
    .then(function( res) {
      const updatedPost = Object.assign(res.body[0], {
        title: 'connect the dots',
        content: 'la la la la la'
      });
      return chai.request(app)
        .put(`/blog-posts/${res.body[0].id}`)
        .send(updatedPost)
        .then(function(res) {
          res.should.have.status(204);
        });
    });
});
});
