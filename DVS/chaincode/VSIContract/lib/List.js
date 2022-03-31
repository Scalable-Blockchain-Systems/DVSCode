
'use strict';

class Node {
	// constructor
	constructor(distance,bus,parent) {
		this.distance = distance;
		this.bus=bus;
		this.parent=parent;
	}
}

class List {
	constructor(length,weekbus) {
	
		this.size = 0;
		// this.PI=0;
		// this.range_start=0;
		// this.range_end=0;
		this.weekbus=weekbus;
		this.Visitedarray=new Array(length);
		this.sortedelement=[];
		//console.log(this.array[0]== undefined);
	}
	

    addFirstRow(listofbuses){

	    for (let i=0; i< listofbuses.length;i++){
			if (i==this.weekbus)
				continue;
			else{
                 if (listofbuses[i]!=0){
					
					var node=new Node(listofbuses[i],i,this.weekbus);
					this.Visitedarray[i]=listofbuses[i];
                    this.addToSortedList(node);

				 }

			}
		}

	}

	ReplaceFirstNode(listofbuses){
		// console.log("inside replace First Node");
		// this.printSortedList();
		var parent=this.sortedelement[0]
		this.sortedelement.splice(0, 1); 
		this.size--;
		// console.log("parent:");
		// console.log(parent.distance);
        // console.log("print:");
		//this.printSortedList();
		for (let i=0; i< listofbuses.length;i++){
			if (i==this.weekbus)
				continue;
			else{
                 if (listofbuses[i]!=0){
					if(this.CheckBusVisited(i)){
                         continue;
					}
					else{
					var node=new Node(listofbuses[i]+parent.distance,i,parent.bus);
					this.Visitedarray[i]=listofbuses[i]+parent.distance;
					this.addToSortedList(node);
					}

				 }

			}
		} 
	}

	addToSortedList(node){

		if (this.size==0){
			this.sortedelement.push(node);
			this.size++;
		}
		else if (this.size==1){
            if (this.sortedelement[0].distance>node.distance){
				 var temp=this.sortedelement[0];
				 this.sortedelement[0]=node;
				 this.sortedelement.push(temp);
			}
			else{
				this.sortedelement.push(node);
			}
			this.size++;
		}
		else{
            var added=false;
			var start=0;
			var end=this.size-1;
            var pos=0;
			while (start <= end) {
				let mid = Math.floor((start + end) / 2);
		 
				// If K is found
				if (node.distance==this.sortedelement[mid].distance){
				     pos=mid; added=true; break;}

				else if (node.distance>this.sortedelement[mid].distance)
					 start = mid + 1;
		 
				else
					 end = mid - 1;
			}
		 
			// Return insert position
			if (!added)
				pos= end + 1;
			this.sortedelement.splice(pos, 0, node);
            this.size++;
		}
		
	}

	
	
	getFirstElement(){
		return this.sortedelement[0];
	}
	printSortedList(){

		for (let i=0;i<this.size;i++){

			console.log("bus: ");
			console.log(this.sortedelement[i].bus);
			console.log("distance: ");
			console.log(this.sortedelement[i].distance);
		}
	}
	CheckBusVisited(num){

		return (this.Visitedarray[num]!= undefined);
	}

	isEmpty(){

		return (this.size==0);
	}

	// // insert element at the position index
	// // of the list
	// insertAt(element, index) {
	// 	if (index < 0 || index > this.size)
	// 		return console.log("Please enter a valid index.");
	// 	else {
	// 		// creates a new node
	// 		var node = new Node(element);
	// 		var curr, prev;

	// 		curr = this.head;

	// 		// add the element to the
	// 		// first index
	// 		if (index == 0) {
	// 			node.next = this.head;
	// 			this.head = node;
	// 		} else {
	// 			curr = this.head;
	// 			var it = 0;

	// 			// iterate over the list to find
	// 			// the position to insert
	// 			while (it < index) {
	// 				it++;
	// 				prev = curr;
	// 				curr = curr.next;
	// 			}

	// 			// adding an element
	// 			node.next = curr;
	// 			prev.next = node;
	// 		}
	// 		this.size++;
	// 	}
	// }

	// // removes an element from the
	// // specified location
	// removeFrom(index) {
	// 	if (index < 0 || index >= this.size)
	// 		return console.log("Please Enter a valid index");
	// 	else {
	// 		var curr, prev, it = 0;
	// 		curr = this.head;
	// 		prev = curr;

	// 		// deleting first element
	// 		if (index === 0) {
	// 			this.head = curr.next;
	// 		} else {
	// 			// iterate over the list to the
	// 			// position to removce an element
	// 			while (it < index) {
	// 				it++;
	// 				prev = curr;
	// 				curr = curr.next;
	// 			}

	// 			// remove the element
	// 			prev.next = curr.next;
	// 		}
	// 		this.size--;

	// 		// return the remove element
	// 		return curr.element;
	// 	}
	// }

	// // removes a given element from the
	// // list
	// removeElement(element) {
	// 	var current = this.head;
	// 	var prev = null;

	// 	// iterate over the list
	// 	while (current != null) {
	// 		// comparing element with current
	// 		// element if found then remove the
	// 		// and return true
	// 		if (current.element === element) {
	// 			if (prev == null) {
	// 				this.head = current.next;
	// 			} else {
	// 				prev.next = current.next;
	// 			}
	// 			this.size--;
	// 			return current.element;
	// 		}
	// 		prev = current;
	// 		current = current.next;
	// 	}
	// 	return -1;
	// }


	// // finds the index of element
	// indexOf(element) {
	// 	var count = 0;
	// 	var current = this.head;

	// 	// iterate over the list
	// 	while (current != null) {
	// 		// compare each element of the list
	// 		// with given element
	// 		if (current.element === element)
	// 			return count;
	// 		count++;
	// 		current = current.next;
	// 	}

	// 	// not found
	// 	return -1;
	// }

	// checks the list for empty
	isEmpty() {
		return this.size == 0;
	}

	// gives the size of the list
	size_of_list() {
		return this.size;
	}




}

module.exports=List;

