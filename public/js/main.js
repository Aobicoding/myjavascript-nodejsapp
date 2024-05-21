$(document).ready(function(){
   $('.delete-jersey').on('click', function(e){
     $target = $(e.target);
     const id = ($target.attr('data-id'));
     $.ajax({
        type:'DELETE', 
        url: '/jersey/'+id,
        success: function(response){
            alert('Deleting Jersey Info');
            window.location.href='/';

        },
        error: function(err){
           console.log(err);
        }
     });

   });


     $().on('click', function(e){
         e.preventDefault();
        console.log('clicked');
     })
});