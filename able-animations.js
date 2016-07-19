angular.module('able')

.animation('.checkoutAnimate', [function(){
	return {
		enter: function(element, done) {
			TweenLite.set(element, {position:'relative', height:'auto'});
			TweenLite.from(element, 0.5, {height:'0', ease:Power2.easeInOut, onComplete: done});
    },
		leave: function(element, done) {
			TweenLite.set(element, {position:'relative', height:'auto'});
			TweenLite.to(element, 0.5, {height:'0', ease:Power2.easeInOut, onComplete: done});
    }
	}
}])

.animation('.productsListAnimate', [function(){
	return {
		enter: function(element, done) {
			var time = 0.1 * (element[0].childElementCount-2)
			TweenLite.set(element, {position:'relative', height:'auto'});
			TweenLite.from(element, time, {height:'0', ease:Power2.easeInOut, onComplete: done});
    },
		leave: function(element, done) {
			var time = 0.1 * (element[0].childElementCount-2)
			TweenLite.set(element, {position:'relative', height:'auto'});
			TweenLite.to(element, time, {height:'0', ease:Power2.easeInOut, onComplete: done});
    }
	}
}])


.animation('.productListedAnimate', [function(){
	return {
		enter: function(element, done) {
			var t = new TimelineLite()
			t.add(TweenLite.set(element, {position:'relative', height:'auto'}))
			t.add(TweenLite.from(element, 0.1, {height:'0', ease:Power2.easeInOut}))
			t.add(TweenLite.from(element, 0.1, {opacity:'0', ease:Power2.easeInOut, delay:'0.1', onComplete: done}))
    },
		leave: function(element, done) {
			var t = new TimelineLite()
			t.add(TweenLite.set(element, {position:'relative', height:'auto'}))
			t.add(TweenLite.to(element, 0.1, {opacity:'0', ease:Power2.easeInOut}))
			t.add(TweenLite.to(element, 0.1, {height:'0', ease:Power2.easeInOut, delay:'0.1', onComplete: done}))
    }
	}
}])


.animation('.progressOverlayAnimate', [function(){
	return {
		enter: function(element, done) {
			TweenLite.from(element, 0.25, {opacity:'0', ease:Power2.easeInOut, onComplete: done});
		},
		leave: function(element, done) {
			TweenLite.to(element, 0.5, {opacity:'0', ease:Power2.easeInOut, onComplete: done});
		}
	}
}])
