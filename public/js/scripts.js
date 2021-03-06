// Change Backbone id format to mongodb _id 
Backbone.Model.prototype.idAttribute = '_id';

// Model class for each Blog item
var Blog = Backbone.Model.extend({
  defaults: {
    author: '',
    title: '',
    url: ''
  }
});

// Collection class for Muppet list endpoint
var Blogs = Backbone.Collection.extend({
  url: 'http://localhost:3001/api/blogs',
  model: Blog,

});

/*
// Create a new list collection, a list view, and then fetch list data:
var blog1 = new Blog({
  author: 'Michael',
  title: 'Michael\'s Blog',
  url: 'http://michaelsblog.com'
});

var blog2 = new Blog({
  author: 'Jhon',
  title: 'Jhon\'s Blog',
  url: 'http://jhonsblog.com'
});

// Instantiate a Collection
var blogs = new Blogs([blog1, blog2]);
*/

// View class for Blog item
var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: 'tr',
  className: 'blog',

  initialize: function() {
    this.template = _.template($('#blog-item-template').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  events: {
    'click .edit-blog': 'onEdit',
    'click .update-blog': 'onUpdate',
    'click .cancel': 'onCancel',
    'click .remove-blog': 'onRemove',
  },

  onEdit: function() {
    this.$('.edit-blog').hide();
    this.$('.remove-blog').hide();
    this.$('.update-blog').show();
    this.$('.cancel').show();  

    var author = this.$('.author').html();
    var title = this.$('.title').html();
    var url = this.$('.url').html();

    this.$('.author').html('<input class="form-control author-update" value="'+author+'">');
    this.$('.title').html('<input class="form-control title-update" value="'+title+'">');
    this.$('.url').html('<input class="form-control url-update" value="'+url+'">');
  },

  onUpdate: function() {
    this.model.set({'author': $('.author-update').val(), 'title': $('.title-update').val(), 'url': $('.url-update').val()});
    this.model.save(null, {
      success: function(response) {
        console.log('Successfully UPDATED blog with _id: ' +response.toJSON()._id);
      },
      error: function() {
        console.log('Failed to UPDATE blog.');
      }
    });
  },
  
  onCancel: function() {
    blogsView.render();
  },

  onRemove: function() {
    this.model.destroy({
      success: function(response) {
        console.log('Successfully REMOVED blog with _id: ' +response.toJSON()._id);
      },
      error: function() {
        console.log('Failed to REMOVE blog.');     
      }
    });
  }

});

var blogs = new Blogs();

// View class for Blog lists
var BlogsView = Backbone.View.extend({
  model: blogs, 
  el: $('.blogs-list'),

  initialize: function() {
    this.model.on('add', this.render, this);
    this.model.on('change', this.render, this);
    this.model.on('remove', this.render, this);

    this.model.fetch({
      success: function(response) {
        _.each(response.toJSON(), function(item) {
          console.log('Successfully fetched blog with _id: ' +item._id);
        });
      },
      error: function(error) {
        console.log('Failed to fetch bogs.');        
      }
    });
  },

  render: function() {
    this.$el.empty();
    var self = this;
    _.each(this.model.toArray(), function (blog) {
      self.$el.append((new BlogView({model: blog})).render().$el);
    });

    return this;
  },

  events: {
    
  }
    
});

/*Instantiate blogsView*/
var blogsView = new BlogsView();

$(document).ready(function() {
  $('.add-blog').on('click', function() {
    var blog = new Blog({
      author: $('.author-input').val(),
      title: $('.title-input').val(),
      url: $('.url-input').val(),
    });
    $('.author-input').val('');
    $('.title-input').val('');
    $('.url-input').val('');

    blogs.add(blog);
    
    blog.save(null, {
      success: function(response) {
        console.log('Successfully saved blog with _id: ' +response.toJSON()._id);
      },
      error: function() {
        console.log('Failed to save blog.');
      }
    });
  })
})







