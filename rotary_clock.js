//please excuse the lack of comments
const canvas = document.getElementById("canvas-clock");
const ctx = canvas.getContext('2d');

let fps = 30;
let timeStart = 0;
let frameCounter = 0;

const clockMargin = 10;
let clockColor = "#ffffff";
let clockColor2 = "#ff0000";
let clockLineWidth = "4";
let handLineWidth = "2";

let optionNumerals = true;
let optionInvert = false;
let optionSmooth = true;
let option24Hour = false;

function resizeCanvas()
{
	const minusWidth = 50;
	const minSize = 200;
	if(window.innerWidth - minusWidth < minSize || window.innerHeight - minusWidth < minSize)
	{
		canvas.width = minSize;
		canvas.height = minSize;
	}
	else
	{
		if(window.innerHeight < window.innerWidth)
		{
			canvas.height = window.innerHeight - minusWidth;
			canvas.width = canvas.height;
		}
		else
		{
			canvas.width = window.innerWidth - minusWidth;
			canvas.height = canvas.width;
		}
	}
}

function drawAxis()
{
	const originX = 0;
	const originY = 0;
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const radius = canvas.width / 2 - clockMargin;
	//draw the hand
	ctx.translate(centerX, centerY);
	ctx.beginPath();
	ctx.fillStyle = clockColor2;
	ctx.arc(originX, originY, 4, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.strokeStyle = clockColor2;
	ctx.lineWidth = handLineWidth;
	ctx.moveTo(originX, originY);
	ctx.lineTo(originX, Math.floor(originY - radius - clockLineWidth / 2));
	ctx.stroke();
	ctx.translate(-centerX, -centerY);
}

function drawFace(radius, rotateDeg, bgColor = "#000000", max = 60, interval = 5)
{
	const originX = 0;
	const originY = 0;
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;

	ctx.translate(centerX, centerY);
	ctx.rotate(rotateDeg * Math.PI / 180);
	//draw the back of the face
	ctx.beginPath();
	ctx.fillStyle = bgColor;
	ctx.arc(originX, originY, radius, 0, 2 * Math.PI);
	ctx.fill();
	//draw the numerals or non-numerals
	const numIntervals  = max / interval;
	let iRadian = 360 / numIntervals * Math.PI / 180;
	if(optionNumerals)
	{
		for(let i = 0; i < numIntervals; i++)
		{
			ctx.beginPath();
			ctx.fillStyle = clockColor;
			ctx.rotate(iRadian * i);
			ctx.font = "" + Math.floor(radius * .12) + "px Helvetica";
			ctx.textAlign = "center";
			if(i == 0)
				ctx.fillText("" + max, originX, Math.floor(originY - radius * .8))
			else
				ctx.fillText("" + i * interval, originX, Math.floor(originY - radius * .8));
			ctx.rotate(-iRadian * i);
		}
	}
	else
	{
		for(let i = 0; i < numIntervals; i++)
		{
			ctx.beginPath();
			if(i == 0) //0 or 12 mark
				ctx.strokeStyle = clockColor2;
			else //the rest
				ctx.strokeStyle = clockColor;
			ctx.lineWidth = clockLineWidth;
			ctx.rotate(iRadian * i);
			ctx.moveTo(originX, Math.floor(originY - radius * .8));
			ctx.lineTo(originX, Math.floor(originY - radius * .9));
			ctx.stroke();
			ctx.rotate(-iRadian * i);
		}
	}
	ctx.rotate(-rotateDeg * Math.PI / 180);
	//draw the border
	ctx.beginPath();
	ctx.strokeStyle = clockColor;
	ctx.lineWidth = clockLineWidth
	ctx.arc(originX, originY, radius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.translate(-centerX, -centerY);
}

function drawConcentricClock()
{
	//calculate how far each dial is rotated using time
	const date = new Date();
	let degHours;
	let degMins;
	let degSecs;
	let radiusHours;
	let radiusMins;
	let radiusSecs;
	let hours;
	if(option24Hour)
		hours = 24;
	else
		hours = 12;
	if(optionSmooth)
	{
		degHours = -(360 / hours * date.getHours() + 360 / hours / 60 * date.getMinutes());
		degMins = -(360 / 60 * date.getMinutes() + 360 / 60 / 60 * date.getSeconds());
		degSecs = -(360 / 60 * date.getSeconds() + 360 / 60 / 1000 * date.getMilliseconds());
	}
	else
	{
		degHours = -(360 / hours * date.getHours());
		degMins = -(360 / 60 * date.getMinutes());
		degSecs = -(360 / 60 * date.getSeconds());
	}

	const bigRadius = canvas.width / 2 - clockMargin;
	const medRadius = bigRadius * .66;
	const smallRadius = medRadius * .66;
	if(optionInvert)
	{
		radiusHours = smallRadius;
		radiusMins = medRadius;
		radiusSecs = bigRadius;
		drawFace(radiusSecs, degSecs, "#220000");
		drawFace(radiusMins, degMins, "#002200");
		drawFace(radiusHours, degHours, bgColor = "#000022", max = hours, interval = 1);
	}
	else
	{
		radiusHours = bigRadius;
		radiusMins = medRadius;
		radiusSecs = smallRadius;
		drawFace(radiusHours, degHours, bgColor = "#000022", max = hours, interval = 1);
		drawFace(radiusMins, degMins, "#002200");
		drawFace(radiusSecs, degSecs, "#220000");
	}
	drawAxis();
}

function updateCanvas(timestamp)
{
	//run drawing routine at target fps
	if(timeStart === undefined)
		start = timestamp;
	const elapsed = timestamp - timeStart;

	if(elapsed > 1000 / fps * frameCounter)
	{
		frameCounter++;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawConcentricClock();
	}
	window.requestAnimationFrame(updateCanvas);
}

//button onclick events
function toggleInvert()
{
	const buttonElem = document.getElementById("invert-button");
	optionInvert = !optionInvert;
	buttonElem.value = "Invert: " + optionInvert;
}

function toggleSmooth()
{
	const buttonElem = document.getElementById("smooth-button");
	optionSmooth = !optionSmooth;
	buttonElem.value = "Smooth: " + optionSmooth;
}

function toggleNum()
{
	const buttonElem = document.getElementById("num-button");
	optionNumerals = !optionNumerals;
	buttonElem.value = "Numerals: " + optionNumerals;
}

function toggle24Hour()
{
	const buttonElem = document.getElementById("24h-button");
	option24Hour = !option24Hour;
	if(option24Hour)
		buttonElem.value = "Format: 24-hour";
	else
		buttonElem.value = "Format: 12-hour";
}

function setValueButtons()
{
	let buttonElem = document.getElementById("invert-button");
	buttonElem.value = "Invert: " + optionInvert;
	buttonElem = document.getElementById("smooth-button");
	buttonElem.value = "Smooth: " + optionSmooth;
	buttonElem = document.getElementById("num-button");
	buttonElem.value = "Numerals: " + optionNumerals;
	buttonElem = document.getElementById("24h-button");
	if(option24Hour)
		buttonElem.value = "Format: 24-hour";
	else
		buttonElem.value = "Format: 12-hour";
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);
window.requestAnimationFrame(updateCanvas);
window.onload = setValueButtons;
