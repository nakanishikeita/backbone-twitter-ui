(function () {
  "use strict";

  var Tweet = Backbone.Model.extend({
    defaults: {
      content: "",
      favorite: false,
      time: new Date(),
    },

    validate: function(attrs) {
      if ( _.isEmpty(attrs.content) ) {
        return '空白で投稿はできません';
      }
    },

    initialize: function() {
      this.on('invalid', function(model, error) {
        $('.error').html(error);
      });
    }
  });

  var TimeLine = Backbone.Collection.extend({
    model: Tweet
  });

  var TweetView = Backbone.View.extend({
    tagName: 'li',
    className: 'tweet',

    initialize: function() {
      this.model.on('destroy', this.remove, this);
      this.model.on('change', this.render, this);
    },

    events: {
      'click .delete': 'destroy',
      'click .fav': 'favorite'
    },

    remove: function() {
      this.$el.remove();
    },

    destroy: function() {
      if (confirm('are you sure')) {
        this.model.destroy();
      }
    },

    favorite: function() {
      this.model.set('favorite', !this.model.get('favorite'));
    },

    template: _.template($("#tweet-view").html()),

    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });

  var TimeLineView = Backbone.View.extend({
    tagName: 'ul',
    className: 'tweets',

    initialize: function() {
      this.collection.on('add', this.addTweet, this);
    },

    addTweet: function(tweet) {
      var tweetView = new TweetView({model: tweet});
      this.$el.prepend(tweetView.render().el);
      
      $('.tweet-box').val('').focus();
      $('.error').html('');
    },

    render: function() {
      this.collection.each(function(tweet) {
        var tweetView = new TweetView({model: tweet});
        this.$el.prepend(tweetView.render().el);
      }, this);
      return this;
    }
  });

  var FormView = Backbone.View.extend({
    el: '.tweet-form',

    events: {
      'submit': 'submit',
      'keypress .tweet-box': 'keypress'
    },

    submit: function(e) {
      e.preventDefault();

      var tweet = new Tweet();
      if (tweet.set({content: $('.tweet-box').val()}, {validate: true})) {
        tweet.set({time: new Date()});
        this.collection.add(tweet);
      }
    },

    keypress: function(e) {
      if (e.keyCode == 13) {
        $('.tweet-form').submit();
      }
    }
  });

  var timeLine = new TimeLine();

  timeLine.add({
    content: "Backbone.jsのテスト"
  });

  var timeLineView = new TimeLineView({collection: timeLine});
  $(".timeline").html(timeLineView.render().el);
  
  var formView = new FormView({collection: timeLine});

}());