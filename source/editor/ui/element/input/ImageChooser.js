"use strict";

function ImageChooser(parent)
{
	Element.call(this, parent);

	//Background
	this.alpha = document.createElement("img");
	this.alpha.style.visibility = "inherit";
	this.alpha.style.position = "absolute";
	this.alpha.src = Editor.filePath + "alpha.png";
	this.alpha.style.left = "0px";
	this.alpha.style.top = "0px";
	this.alpha.style.width = "100%";
	this.alpha.style.height = "100%";
	this.alpha.style.borderStyle = "none";
	this.element.appendChild(this.alpha);

	//Image
	this.img = document.createElement("img");
	this.img.style.visibility = "inherit";
	this.img.style.position = "absolute";
	this.img.style.borderStyle = "none";
	this.img.style.cursor = "pointer";
	this.img.style.left = "0px";
	this.img.style.top = "0px";
	this.img.style.width = "100%";
	this.img.style.height = "100%";
	this.element.appendChild(this.img);

	//Value
	this.value = null;

	var self = this;

	//On drop get file dropped
	this.element.ondrop = function(event)
	{
		event.preventDefault();

		if(event.dataTransfer.files.length > 0)
		{
			var file = event.dataTransfer.files[0];

			if(Image.fileIsImage(file))
			{
				readImageFile(file);
			}
		}
		else
		{
			var uuid = event.dataTransfer.getData("uuid");
			var value = DragBuffer.popDragElement(uuid);

			if(value instanceof Image)
			{
				self.setValue(value);
				self.onChange(value);
			}
			else
			{
				Editor.alert("Only images accepted");
			}
		}
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Onclick select image file
	this.element.onclick = function()
	{
		if(self.onChange !== null)
		{
			FileSystem.chooseFile(function(files)
			{
				if(files.length > 0)
				{
					readImageFile(files[0]);
				}
			}, "image/*, .tga");
		}
	};

	var readImageFile = function(file)
	{
		var reader = new FileReader();
		reader.onload = function()
		{
			self.setValue(new Image(reader.result));
			self.onChange(self.value);
		};
		reader.readAsDataURL(file);
	};

	//onChange callback
	this.onChange = null;

	//Attributes
	this.size.set(100, 100);
}

ImageChooser.prototype = Object.create(Element.prototype);

//Set onChange callback
ImageChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

//Set image URL
ImageChooser.prototype.setValue = function(image)
{
	this.value = image;
	this.img.src = image.data;
};

//Get image URL
ImageChooser.prototype.getValue = function()
{
	return this.value;
};

//Update Interface
ImageChooser.prototype.updateInterface = function()
{
	if(this.visible)
	{
		//Keep aspect ratio
		if(this.keepAspectRatio)
		{
			if(this.size.x < this.size.y)
			{
				this.size.y = this.size.x * this.img.naturalHeight / this.img.naturalWidth;
			}
			else
			{
				this.size.x = this.size.y * this.img.naturalWidth / this.img.naturalHeight;
			}
		}

		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};
