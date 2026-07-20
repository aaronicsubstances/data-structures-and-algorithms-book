// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function RedBlack(am, w, h)
{
	this.init(am, w, h);

}

RedBlack.prototype = new Algorithm();
RedBlack.prototype.constructor = RedBlack;
RedBlack.superclass = Algorithm.prototype;

RedBlack.prototype.init = function(am, w, h)
{
	var sc = RedBlack.superclass;
	var fn = sc.init;
	fn.call(this,am);
	this.addControls();
	this.nextIndex = 1;
	this.commands = [];
	this.startingX = w / 2;
	this.print_max  = w - PRINT_HORIZONTAL_GAP;
	this.first_print_pos_y  = h - 2 * PRINT_VERTICAL_GAP;


	this.cmd("CreateLabel", 0, "", EXPLANITORY_TEXT_X, EXPLANITORY_TEXT_Y, 0);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
}

RedBlack.prototype.addControls =  function()
{
	this.insertField = addControlToAlgorithmBar("Text", "");
	this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
	this.insertButton = addControlToAlgorithmBar("Button", "Insert");
	this.insertButton.onclick = this.insertCallback.bind(this);
	this.deleteField = addControlToAlgorithmBar("Text", "");
	this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 4);
	this.deleteButton = addControlToAlgorithmBar("Button", "Delete");
	this.deleteButton.onclick = this.deleteCallback.bind(this);
	this.findField = addControlToAlgorithmBar("Text", "");
	this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
	this.findButton = addControlToAlgorithmBar("Button", "Find");
	this.findButton.onclick = this.findCallback.bind(this);
	this.printButton = addControlToAlgorithmBar("Button", "Print");
	this.printButton.onclick = this.printCallback.bind(this);
	
	this.showNullLeaves = addCheckboxToAlgorithmBar("Show Null Leaves");
	this.showNullLeaves.onclick = this.showNullLeavesCallback.bind(this);
	this.showNullLeaves.checked = false;;

}

RedBlack.prototype.reset = function()
{
	this.nextIndex = 1;
	this.treeRoot = null;
}

var FIRST_PRINT_POS_X = 50;
var PRINT_VERTICAL_GAP = 20;
var PRINT_HORIZONTAL_GAP = 50;


var FOREGROUND_RED = "#AA0000";
var BACKGROUND_RED = "#FFAAAA";

var FOREGROUND_BLACK =  "#000000"
var BACKGROUND_BLACK = "#AAAAAA";
var BACKGROUND_DOUBLE_BLACK = "#777777";


// var HIGHLIGHT_LABEL_COLOR = RED
// var HIGHLIGHT_LINK_COLOR = RED


var HIGHLIGHT_LABEL_COLOR = "#FF0000"
var HIGHLIGHT_LINK_COLOR = "#FF0000"

var BLUE = "#0000FF";

var LINK_COLOR = "#000000"
var BACKGROUND_COLOR = BACKGROUND_BLACK;
var HIGHLIGHT_COLOR = "#007700";
var FOREGROUND_COLOR = FOREGROUND_BLACK;
var PRINT_COLOR = FOREGROUND_COLOR

var widthDelta  = 50;
var heightDelta = 50;
var startingY = 50;


var FIRST_PRINT_POS_X  = 40;
var PRINT_VERTICAL_GAP  = 20;
var PRINT_HORIZONTAL_GAP = 50;
var EXPLANITORY_TEXT_X = 10;
var EXPLANITORY_TEXT_Y = 10;

RedBlack.prototype.insertCallback = function(event)
{
	var insertedValue = this.insertField.value;
	// Get text value
	insertedValue = this.normalizeNumber(insertedValue, 4);
	if (insertedValue != "")
	{
		// set text value
		this.insertField.value = "";
		this.implementAction(this.insertElement.bind(this), insertedValue);
	}
}

RedBlack.prototype.deleteCallback = function(event)
{
	var deletedValue = this.deleteField.value;
	if (deletedValue != "")
	{
		deletedValue = this.normalizeNumber(deletedValue, 4);
		this.deleteField.value = "";
		this.implementAction(this.deleteElement.bind(this),deletedValue);		
	}
}


RedBlack.prototype.findCallback = function(event)
{
	var findValue = this.findField.value;
	if (findValue != "")
	{
		findValue = this.normalizeNumber(findValue, 4);
		this.findField.value = "";
		this.implementAction(this.findElement.bind(this),findValue);		
	}
}

RedBlack.prototype.printCallback = function(event)
{
	this.implementAction(this.printTree.bind(this),"");						
}

RedBlack.prototype.showNullLeavesCallback = function(event)
{
	if (this.showNullLeaves.checked)
	{
		this.animationManager.setAllLayers([0,1]);		
	}
	else
	{
		this.animationManager.setAllLayers([0]);
	}
}
		 
		
RedBlack.prototype.printTree = function(unused)
{
	this.commands = [];
	
	if (this.treeRoot != null)
	{
		this.highlightID = this.nextIndex++;
		var firstLabel = this.nextIndex;
		this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, this.treeRoot.x, this.treeRoot.y);
		this.xPosOfNextLabel = FIRST_PRINT_POS_X;
		this.yPosOfNextLabel = this.first_print_pos_y;
		this.printTreeRec(this.treeRoot);
		this.cmd("Delete",this.highlightID);
		this.cmd("Step");
		for (var i = firstLabel; i < this.nextIndex; i++)
			this.cmd("Delete", i);
		this.nextIndex = this.highlightID;  /// Reuse objects.  Not necessary.
	}
	return this.commands;
}

RedBlack.prototype.printTreeRec = function(tree) 
{
	this.cmd("Step");
	if (tree.left != null && !tree.left.phantomLeaf)
	{
		this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
		this.printTreeRec(tree.left);
		this.cmd("Move", this.highlightID, tree.x, tree.y);				
		this.cmd("Step");
	}
	var nextLabelID = this.nextIndex++;
	this.cmd("CreateLabel", nextLabelID, tree.data, tree.x, tree.y);
	this.cmd("SetForegroundColor", nextLabelID, PRINT_COLOR);
	this.cmd("Move", nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
	this.cmd("Step");
	
	this.xPosOfNextLabel +=  PRINT_HORIZONTAL_GAP;
	if (this.xPosOfNextLabel > this.print_max)
	{
		this.xPosOfNextLabel = FIRST_PRINT_POS_X;
		this.yPosOfNextLabel += PRINT_VERTICAL_GAP;
		
	}
	if (tree.right != null && !tree.right.phantomLeaf)
	{
		this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
		this.printTreeRec(tree.right);
		this.cmd("Move", this.highlightID, tree.x, tree.y);	
		this.cmd("Step");
	}
	return;
}


RedBlack.prototype.findElement = function(findValue)
{
	this.commands = [];
	
	this.highlightID = this.nextIndex++;
	
	this.doFind(this.treeRoot, findValue);
	
	
	return this.commands;
}


RedBlack.prototype.doFind = function(tree, value)
{
	this.cmd("SetText", 0, "Searchiing for "+value);
	if (tree != null && !tree.phantomLeaf)
	{
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (tree.data == value)
		{
			this.cmd("SetText", 0, "Searching for "+value+" : " + value + " = " + value + " (Element found!)");
			this.cmd("Step");
			this.cmd("SetText", 0, "Found:"+value);
			this.cmd("SetHighlight", tree.graphicID, 0);
		}
		else
		{
			if (tree.data > value)
			{
				this.cmd("SetText", 0, "Searching for "+value+" : " + value + " < " + tree.data + " (look to left subtree)");
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.left!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
				}
				this.doFind(tree.left, value);
			}
			else
			{
				this.cmd("SetText", 0, " Searching for "+value+" : " + value + " > " + tree.data + " (look to right subtree)");					
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				if (tree.right!= null)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);				
				}
				this.doFind(tree.right, value);						
			}
			
		}
		
	}
	else
	{
		this.cmd("SetText", 0, " Searching for "+value+" : " + "< Empty Tree > (Element not found)");				
		this.cmd("Step");					
		this.cmd("SetText", 0, " Searching for "+value+" : " + " (Element not found)");					
	}
}



RedBlack.prototype.blackLevel = function(tree)
{
	if (tree == null)
	{
		return 1;
	}
	else
	{
		return tree.blackLevel;
	}
}


RedBlack.prototype.attachLeftNullLeaf = function(node)
{
	// Add phantom left leaf
	var treeNodeID = this.nextIndex++;
	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  node.x, node.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
	node.left = new RedBlackNode("", treeNodeID, this.startingX, startingY);
	node.left.phantomLeaf = true;
	this.cmd("SetLayer", treeNodeID, 1);
	node.left.blackLevel = 1;
	this.cmd("Connect",node.graphicID, treeNodeID, LINK_COLOR);
}	

RedBlack.prototype.attachRightNullLeaf = function(node)
{
	// Add phantom right leaf
	treeNodeID = this.nextIndex++;
	this.cmd("CreateCircle", treeNodeID, "NULL\nLEAF",  node.x, node.y);
	this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
	this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
	node.right = new RedBlackNode("", treeNodeID, this.startingX, startingY);
	this.cmd("SetLayer", treeNodeID, 1);
	
	node.right.phantomLeaf = true;
	node.right.blackLevel = 1;
	this.cmd("Connect", node.graphicID, treeNodeID, LINK_COLOR);
	
}
RedBlack.prototype.attachNullLeaves = function(node)
{
	this.attachLeftNullLeaf(node);
	this.attachRightNullLeaf(node);
}

RedBlack.prototype.insertElement = function(insertedValue)
{
	this.commands = new Array();	
	this.cmd("SetText", 0, " Inserting "+insertedValue);
	this.highlightID = this.nextIndex++;
	var treeNodeID;
	if (this.treeRoot == null)
	{
		treeNodeID = this.nextIndex++;
		this.cmd("CreateCircle", treeNodeID, insertedValue,  this.startingX, startingY);
		this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_BLACK);
		this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_BLACK);
		this.treeRoot = new RedBlackNode(insertedValue, treeNodeID, this.startingX, startingY);
		this.treeRoot.blackLevel = 1;
		
		this.attachNullLeaves(this.treeRoot);
		this.resizeTree();
		
	}
	else
	{
		treeNodeID = this.nextIndex++;
		
		this.cmd("CreateCircle", treeNodeID, insertedValue, 30, startingY);
		this.cmd("SetForegroundColor", treeNodeID, FOREGROUND_RED);
		this.cmd("SetBackgroundColor", treeNodeID, BACKGROUND_RED);
		this.cmd("Step");				
		var insertElem = new RedBlackNode(insertedValue, treeNodeID, 100, 100)
		
		this.cmd("SetHighlight", insertElem.graphicID, 1);
		insertElem.height = 1;
		this.insert(insertElem);
		//				resizeTree();				
	}
	this.cmd("SetText", 0, " ");				
	return this.commands;
}

RedBlack.prototype.fixUp = function(tree)
{
	if (!this.blackLevel(tree.right) && this.blackLevel(tree.left)) {
		this.cmd("SetText", 0, "Only right child of node is red -- rotate");
		this.cmd("Step");

		tree = this.singleRotateLeft(tree);
	}
	if (!this.blackLevel(tree.left) && !this.blackLevel(tree.left.left)) {
		this.cmd("SetText", 0, "Double red found in left child and left-left grandchild -- rotate");
		this.cmd("Step");

		tree = this.singleRotateRight(tree);
	}
	if (!this.blackLevel(tree.left) && !this.blackLevel(tree.right)) {
		this.cmd("SetText", 0, "Both children of node are red -- flip colors");
		this.cmd("Step");
		
		this.flipColors(tree);
	}
	return tree;
}

RedBlack.prototype.flipColors = function(tree)
{
	tree.blackLevel = tree.blackLevel ? 0 : 1;
	tree.left.blackLevel = tree.left.blackLevel ? 0 : 1;
	tree.right.blackLevel = tree.right.blackLevel ? 0 : 1;
	
	this.fixNodeColor(tree);
	this.fixNodeColor(tree.left);
	this.fixNodeColor(tree.right);
	this.cmd("Step");
}

RedBlack.prototype.singleRotateRight = function(tree)
{
	var B = tree;
	var t3 = B.right;
	var A = tree.left;
	var t1 = A.left;
	var t2 = A.right;
	
	this.cmd("SetText", 0, "Single Rotate Right");
	this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);
	this.cmd("Step");
	
	// TODO:  Change link color
	
	if (t2 != null)
	{
		this.cmd("Disconnect", A.graphicID, t2.graphicID); 
		this.cmd("Connect", B.graphicID, t2.graphicID, LINK_COLOR);
		t2.parent = B;
	}
	this.cmd("Disconnect", B.graphicID, A.graphicID);
	this.cmd("Connect", A.graphicID, B.graphicID, LINK_COLOR);
	
	A.parent = B.parent;
	if (this.treeRoot == B)
	{
		this.treeRoot = A;
	}
	else
	{
		this.cmd("Disconnect", B.parent.graphicID, B.graphicID, LINK_COLOR);
		this.cmd("Connect", B.parent.graphicID, A.graphicID, LINK_COLOR)
		if (B.isLeftChild())
		{
			B.parent.left = A;
		}
		else
		{
			B.parent.right = A;
		}
	}

	A.blackLevel = B.blackLevel;
	B.blackLevel = 0;

	A.right = B;
	B.parent = A;
	B.left = t2;
	this.resetHeight(B);
	this.resetHeight(A);
	this.resizeTree();

	this.fixNodeColor(A);
	this.fixNodeColor(B);

	return A;
}



RedBlack.prototype.singleRotateLeft = function(tree) 
{
	var A = tree;
	var B = tree.right;
	var t1 = A.left;
	var t2 = B.left;
	var t3 = B.right;
	
	this.cmd("SetText", 0, "Single Rotate Left");
	this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1);
	this.cmd("Step");
	
	if (t2 != null)
	{
		this.cmd("Disconnect", B.graphicID, t2.graphicID);																		  
		this.cmd("Connect", A.graphicID, t2.graphicID, LINK_COLOR);
		t2.parent = A;
	}
	this.cmd("Disconnect", A.graphicID, B.graphicID);
	this.cmd("Connect", B.graphicID, A.graphicID, LINK_COLOR);
	B.parent = A.parent;
	if (this.treeRoot == A)
	{
		this.treeRoot = B;
	}
	else
	{
		this.cmd("Disconnect", A.parent.graphicID, A.graphicID, LINK_COLOR);
		this.cmd("Connect", A.parent.graphicID, B.graphicID, LINK_COLOR)
		
		if (A.isLeftChild())
		{
			A.parent.left = B;
		}
		else
		{
			A.parent.right = B;
		}
	}

	B.blackLevel = A.blackLevel;
	A.blackLevel = 0;

	B.left = A;
	A.parent = B;
	A.right = t2;
	this.resetHeight(A);
	this.resetHeight(B);
	this.resizeTree();

	this.fixNodeColor(A);
	this.fixNodeColor(B);

	return B;
}




RedBlack.prototype.getHeight = function(tree) 
{
	if (tree == null)
	{
		return 0;
	}
	return tree.height;
}

RedBlack.prototype.resetHeight = function(tree)
{
	if (tree != null)
	{
		var newHeight = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
		if (tree.height != newHeight)
		{
			tree.height = Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
		}
	}
}

RedBlack.prototype.insert = function(elem)
{
	this._insert(elem, this.treeRoot);

	if (this.treeRoot.blackLevel == 0)
	{
		this.cmd("SetText", 0, "Root of the tree is red.  Color it black");
		this.cmd("Step");
		
		this.treeRoot.blackLevel = 1;
		this.fixNodeColor(this.treeRoot);
	}
}

RedBlack.prototype._insert = function(elem, tree)
{
	this.cmd("SetHighlight", tree.graphicID, 1);
	this.cmd("SetHighlight", elem.graphicID, 1);
	
	if (elem.data < tree.data)
	{
		this.cmd("SetText", 0, elem.data + " < " + tree.data + ".  Looking at left subtree");				
	}
	else
	{
		this.cmd("SetText",  0, elem.data + " >= " + tree.data + ".  Looking at right subtree");				
	}
	this.cmd("Step");
	this.cmd("SetHighlight", tree.graphicID , 0);
	this.cmd("SetHighlight", elem.graphicID, 0);
	
	if (elem.data < tree.data)
	{
		if (tree.left == null || tree.left.phantomLeaf)
		{
			this.cmd("SetText", 0, "Found null tree (or phantom leaf), inserting element");				
			if (tree.left != null)
			{
				this.cmd("Delete", tree.left.graphicID);
			}
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.left = elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, LINK_COLOR);
			
			this.attachNullLeaves(elem);
			this.resizeTree();

			this.resizeTree();
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			tree.left = this._insert(elem, tree.left);
			tree.left.parent = tree;
		}
	}
	else
	{
		if (tree.right == null || tree.right.phantomLeaf)
		{
			this.cmd("SetText",  0, "Found null tree (or phantom leaf), inserting element");
			if (tree.right != null)
			{
				this.cmd("Delete", tree.right.graphicID);
			}
			
			this.cmd("SetHighlight", elem.graphicID, 0);
			tree.right = elem;
			elem.parent = tree;
			this.cmd("Connect", tree.graphicID, elem.graphicID, LINK_COLOR);
			elem.x = tree.x + widthDelta/2;
			elem.y = tree.y + heightDelta
			this.cmd("Move", elem.graphicID, elem.x, elem.y);
			
			
			this.attachNullLeaves(elem);
			this.resizeTree();
			
			this.resizeTree();
		}
		else
		{
			this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			tree.right = this._insert(elem, tree.right);
			tree.right.parent = tree;
		}
	}
	
	return this.fixUp(tree);
}


RedBlack.prototype.deleteElement = function(deletedValue)
{
	this.commands = new Array();
	this.cmd("SetText", 0, "Deleting "+deletedValue);
	this.cmd("Step");
	this.cmd("SetText", 0, " ");
	this.highlightID = this.nextIndex++;
	this.treeDelete(deletedValue);
	this.cmd("SetText", 0, " ");			
	// Do delete
	return this.commands;						
}

RedBlack.prototype.treeDelete = function(deletedValue)
{
	if (this.treeRoot && this.blackLevel(this.treeRoot.left))
	{
		this.cmd("SetText", 0, "Invariant of red root or red left child not in place. Color root red");
		this.cmd("Step");

		this.treeRoot.blackLevel = 0;
		this.fixNodeColor(this.treeRoot);
	}

	this._treeDelete(this.treeRoot, deletedValue);

	if (this.treeRoot && this.treeRoot.blackLevel == 0)
	{
		this.cmd("SetText", 0, "Root of the tree is red.  Color it black");
		this.cmd("Step");
		
		this.treeRoot.blackLevel = 1;
		this.fixNodeColor(this.treeRoot);
	}
}

RedBlack.prototype._treeDelete = function(tree, valueToDelete, foundAlready)
{
	if (!tree || tree.phantomLeaf)
	{
		this.cmd("SetText", 0, "Element "+valueToDelete+" not found, could not delete");
		this.cmd("Step");
		return null;
	}

	if (!foundAlready && valueToDelete !== tree.data)
	{
		this.cmd("SetHighlight", tree.graphicID, 1);
		if (valueToDelete < tree.data)
		{
			this.cmd("SetText", 0, valueToDelete + " < " + tree.data + ".  Looking at left subtree");				
		}
		else
		{
			this.cmd("SetText", 0, valueToDelete + " > " + tree.data + ".  Looking at right subtree");				
		}
		this.cmd("Step");
		this.cmd("SetHighlight", tree.graphicID, 0);
	}

	if (valueToDelete < tree.data)
	{
		if ((tree.left && !tree.left.phantomLeaf) && this.blackLevel(tree.left)
			&& this.blackLevel(tree.left.left))
		{
			// move red to left
			this.cmd("SetText", 0, "Begin move red link to left");
			this.flipColors(tree);
			if (!this.blackLevel(tree.right.left))
			{
				tree.right = this.singleRotateRight(tree.right);
				tree = this.singleRotateLeft(tree);
				this.flipColors(tree);
			}
			this.cmd("SetText", 0, "End move red link to left");
			this.cmd("Step");
		}

		if (tree.left && !tree.left.phantomLeaf)
		{
			this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
			this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
			this.cmd("Step");
			this.cmd("Delete", this.highlightID);
			tree.left = this._treeDelete(tree.left, valueToDelete, foundAlready);
			if (!tree.left)
			{
				this.attachLeftNullLeaf(tree);
				this.resizeTree();
			}
			tree.left.parent = tree;
		}
		else
		{
			this.cmd("SetText", 0, "Element "+valueToDelete+" not found, could not delete");
			this.cmd("Step");
		}
	}
	else
	{
		if (!this.blackLevel(tree.left))
		{
			this.cmd("SetText", 0, "Preemptively pass red left link to the right");
		  	tree = this.singleRotateRight(tree);
		}
		if (valueToDelete === tree.data && (!tree.right || tree.right.phantomLeaf))
		{
			if (!foundAlready)
			{
				foundAlready = true;
				this.cmd("SetHighlight", tree.graphicID, 1);
				this.cmd("SetText", 0, valueToDelete + " == " + tree.data + ".  Found node to delete");	
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
			}
			else
			{
				this.cmd("SetHighlight", tree.graphicID, 1);
				this.cmd("SetText", 0, valueToDelete + " == " + tree.data + ".  Found duplicate successor key to delete");	
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
			}

			
			if (tree.parent)
			{
				this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
			}
			this.cmd("Step");
			this.cmd("Delete", tree.graphicID);
			if (tree.left)
			{
				// has to be that tree.left.phantomLeaf is true
				if (!tree.left.phantomLeaf)
				{
					throw new Error("tree.left can only be phantom at this stage");
				}
				this.cmd("Delete", tree.left.graphicID);
			}
			if (tree.right)
			{
				this.cmd("Delete", tree.right.graphicID);
			}
			if (tree == this.treeRoot)
			{
				this.treeRoot = null;
			}
		  	return null;
		}
		else
		{
		  	if ((tree.right && !tree.right.phantomLeaf) && this.blackLevel(tree.right)
				&& this.blackLevel(tree.right.left))
			{
				// move red to right
				this.cmd("SetText", 0, "Begin move red link to right");
				this.flipColors(tree);
				if (!this.blackLevel(tree.left.left))
				{
					tree = this.singleRotateRight(tree);
					this.flipColors(tree);
				}
				this.cmd("SetText", 0, "End move red link to right");
				this.cmd("Step");
		  	}
		  	if (valueToDelete === tree.data)
			{
				if (!foundAlready)
				{
					foundAlready = true;
					this.cmd("SetHighlight", tree.graphicID, 1);
					this.cmd("SetText", 0, valueToDelete + " == " + tree.data + ".  Found node to delete");	
					this.cmd("Step");
					this.cmd("SetHighlight", tree.graphicID, 0);
				}
				else
				{
					this.cmd("SetHighlight", tree.graphicID, 1);
					this.cmd("SetText", 0, valueToDelete + " == " + tree.data + ".  Found duplicate successor key to delete");	
					this.cmd("Step");
					this.cmd("SetHighlight", tree.graphicID, 0);
				}

				this.highlightID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
				var tmp = tree;
				tmp = tree.right;
				this.cmd("Move", this.highlightID, tmp.x, tmp.y);
				this.cmd("Step");																									
				while (tmp.left != null && !tmp.left.phantomLeaf)
				{
					tmp = tmp.left;
					this.cmd("Move", this.highlightID, tmp.x, tmp.y);
					this.cmd("Step");																									
				}
				if (tmp.left != null)
				{
					this.cmd("Delete", tmp.left.graphicID);
					tmp.left = null;
				}
				this.cmd("SetText", tree.graphicID, " ");
				var labelID = this.nextIndex;
				this.nextIndex += 1;
				this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
				this.cmd("SetForegroundColor", labelID, BLUE);
				tree.data = tmp.data;
				this.cmd("Move", labelID, tree.x, tree.y);
				this.cmd("SetText", 0, "Copy smallest value of right subtree into node to delete.");									
				
				this.cmd("Step");
				this.cmd("SetHighlight", tree.graphicID, 0);
				this.cmd("Delete", labelID);
				this.cmd("SetText", tree.graphicID, tree.data);
				this.cmd("Delete", this.highlightID);							
				this.cmd("SetText", 0, "Remove node whose value we copied.");

				tree.right = this._treeDelete(tree.right, tree.data, foundAlready);
				if (!tree.right)
				{
					this.attachRightNullLeaf(tree);
					this.resizeTree();
				}
				tree.right.parent = tree;
			}
			else
			{
				if (tree.right && !tree.right.phantomLeaf)
				{
					this.cmd("CreateHighlightCircle", this.highlightID, HIGHLIGHT_COLOR, tree.x, tree.y);
					this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
					this.cmd("Step");
					this.cmd("Delete", this.highlightID);
					tree.right = this._treeDelete(tree.right, valueToDelete, foundAlready);
					if (!tree.right)
					{
						this.attachRightNullLeaf(tree);
						this.resizeTree();
					}
					tree.right.parent = tree;
				}
				else
				{
					this.cmd("SetText", 0, "Element "+valueToDelete+" not found, could not delete");
					this.cmd("Step");
				}
			}
		}
	}
	return this.fixUp(tree);
}


RedBlack.prototype.fixNodeColor = function(tree)
{
	if (tree.blackLevel == 0)
	{
		this.cmd("SetForegroundColor", tree.graphicID, FOREGROUND_RED);
		this.cmd("SetBackgroundColor", tree.graphicID, BACKGROUND_RED);									
	}
	else
	{
		this.cmd("SetForegroundColor", tree.graphicID, FOREGROUND_BLACK);
		this.cmd("SetBackgroundColor",tree.graphicID, BACKGROUND_BLACK);
	}
}




RedBlack.prototype.resizeTree = function()
{
	var startingPoint  = this.startingX;
	this.resizeWidths(this.treeRoot);
	if (this.treeRoot != null)
	{
		if (this.treeRoot.leftWidth > startingPoint)
		{
			startingPoint = this.treeRoot.leftWidth;
		}
		else if (this.treeRoot.rightWidth > startingPoint)
		{
			startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
		}
		this.setNewPositions(this.treeRoot, startingPoint, startingY, 0);
		this.animateNewPositions(this.treeRoot);
		this.cmd("Step");
	}
	
}

RedBlack.prototype.setNewPositions = function(tree, xPosition, yPosition, side)
{
	if (tree != null)
	{
		tree.y = yPosition;
		if (side == -1)
		{
			xPosition = xPosition - tree.rightWidth;
			tree.heightLabelX = xPosition - 20;
		}
		else if (side == 1)
		{
			xPosition = xPosition + tree.leftWidth;
			tree.heightLabelX = xPosition + 20;
		}
		else
		{
			tree.heightLabelX = xPosition - 20;
		}
		tree.x = xPosition;
		tree.heightLabelY = tree.y - 20;
		this.setNewPositions(tree.left, xPosition, yPosition + heightDelta, -1)
		this.setNewPositions(tree.right, xPosition, yPosition + heightDelta, 1)
	}
	
}
RedBlack.prototype.animateNewPositions = function(tree)
{
	if (tree != null)
	{
		this.cmd("Move", tree.graphicID, tree.x, tree.y);
		this.animateNewPositions(tree.left);
		this.animateNewPositions(tree.right);
	}
}

RedBlack.prototype.resizeWidths = function(tree) 
{
	if (tree == null)
	{
		return 0;
	}
	tree.leftWidth = Math.max(this.resizeWidths(tree.left), widthDelta / 2);
	tree.rightWidth = Math.max(this.resizeWidths(tree.right), widthDelta / 2);
	return tree.leftWidth + tree.rightWidth;
}


RedBlack.prototype.disableUI = function(event)
{
	this.insertField.disabled = true;
	this.insertButton.disabled = true;
	this.deleteField.disabled = true;
	this.deleteButton.disabled = true;
	this.findField.disabled = true;
	this.findButton.disabled = true;
	this.printButton.disabled = true;
}

RedBlack.prototype.enableUI = function(event)
{
	this.insertField.disabled = false;
	this.insertButton.disabled = false;
	this.deleteField.disabled = false;
	this.deleteButton.disabled = false;
	this.findField.disabled = false;
	this.findButton.disabled = false;
	this.printButton.disabled = false;
}


/////////////////////////////////////////////////////////
// Red black node
////////////////////////////////////////////////////////


function RedBlackNode(val, id, initialX, initialY)
{
	this.data = val;
	this.x = initialX;
	this.y = initialY;
	this.blackLevel = 0;
	this.phantomLeaf = false;
	this.graphicID = id;
	this.left = null;
	this.right = null;
	this.parent = null;
	this.height = 0;
	this.leftWidth = 0;
	this.rightWidth = 0;
}

RedBlackNode.prototype.isLeftChild = function()
{
	if (this.parent == null)
	{
		return true;
	}
	return this.parent.left == this;
}



/////////////////////////////////////////////////////////
// Setup stuff
////////////////////////////////////////////////////////


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new RedBlack(animManag, canvas.width, canvas.height);
}