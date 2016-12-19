var main = function(toDoObjects) {
  "use strict";
   var toDos,
       tabs,
       $content,
       $input,
       $button,
       i;

   toDos = toDoObjects.map(function (toDo) {
     return toDo.description;
   });
  
  tabs = [];


       tabs.push({
          "name": "Newest",
	  "content": function(callback) {
           $.getJSON("todos.json", function(toDoObjects) {
	     $content = $("<ul>");
             for(i = toDos.length-1; i >= 0; i--) {
                $content.append($("<li>").text(toDos[i]));
             }	     
            callback($content);
            });
            }   
       });

       tabs.push({
          "name": "Oldest",
	  "content": function(callback) {
                $.getJSON("todos.json", function(toDoObjects) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                   $content.append($("<li>").text(todo));
                });
             callback($content);
          });
	  }
       });

       tabs.push({
          "name": "Tags",
	  "content": function(callback) {
             $.getJSON("todos.json", function(toDoObjects){
               var tags = [];

                toDoObjects.forEach(function (toDo) {
                   toDo.tags.forEach(function (tag) {
                      if (tags.indexOf(tag) === -1) {
	                tags.push(tag);
	              }         
                   });
                });

                var tagObjects = tags.map(function (tag) {
                   var toDosWithTag = [];

	           toDoObjects.forEach(function (toDo) {
	              if (toDo.tags.indexOf(tag) !== -1) {
	                toDosWithTag.push(toDo.description);
	              }
	           });
                   return { "name" : tag, "toDos" : toDosWithTag };
                });	

               tagObjects.forEach(function (tag) {
                  var $tagName = $("<h3>").text(tag.name),
                  $content = $("<ul>");

                  tag.toDos.forEach(function (description) {
                     var $li = $("<li>").text(description);
	             $content.append($li);
                  });

                $content = $("main .content").append($tagName)
                                             .append($content);
              });
	     callback($content);
	  }); 
          }
	});

   
      tabs.push({
         "name": "Add",
	 "content": function(callback){
           $.getJSON("todos.json", function(toDoObjects) {
            var $input = $("<input>").addClass("description"),
            $inputLabel = $("<p>").text("Description: "),
     	    $tagInput = $("<input>").addClass("tags"),
     	    $tagLabel = $("<p>").text("Tags: "),
     	    $button = $("<button>").text("+");

            $button.on("click", function () {
              var description = $input.val(),
                tags = $tagInput.val().split(","),
	        newToDo = {"description":description, "tags":tags};

	        toDoObjects.push({"description":description, "tags":tags});

	        $.post("todos", newToDo, function(response) {
	           console.log(response);
	        });
   
	     toDos = toDoObjects.map(function(toDo) {
	     return toDo.description;
	     });
	
	       $input.val("");
	       $tagInput.val("");
            });	

   	    $content = $("<div>").append($inputLabel)
			         .append($input)
			         .append($tagLabel)
    			         .append($tagInput)
	   		         .append($button);
	    callback($content);
         });
	 }
     });   
     tabs.forEach(function(tab) {
        var $aElement = $("<a>").attr("href","#"),
            $spanElement = $("<span>").text(tab.name);
        $aElement.append($spanElement);
        $("main .tabs").append($aElement);


	$spanElement.on("click", function() {
	   var $content;

           $(".tabs a span").removeClass("active");
           $spanElement.addClass("active");
           $("main .content").empty();


           tab.content(function ($content) {
              if (tab.name !== "Tags") {
                 $("main .content").append($content);
              };
           });
        });
    });

};
$(document).ready(function () {
   $.getJSON("todos.json", function (toDoObjects) {
      main(toDoObjects);
      });
   });
