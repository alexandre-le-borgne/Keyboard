/**
 * Created by Alexandre on 21/06/2016.
 */
//Object.prototype.getKeyByValue = function( value ) {
//    for( var prop in this ) {
//        if( this.hasOwnProperty( prop ) ) {
//             if( this[ prop ] === value )
//                 return prop;
//        }
//    }
//};

jQuery.extend( jQuery.fn, {
    // Name of our method & one argument (the parent selector)
    within: function( pSelector ) {
        // Returns a subset of items using jQuery.filter
        return this.filter(function(){
            // Return truthy/falsey based on presence in parent
            return $(this).closest( pSelector ).length;
        });
    }
});