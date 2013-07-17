﻿//Question: model - what type ?
//
//

var TAX_LEVELS = [
		  {upper: 1500, rate: 0.03},
		  {upper: 4500, rate: 0.1},
		  {upper: 9000, rate: 0.2},
		  {upper: 35000, rate: 0.25},
		  {upper: 55000, rate: 0.3},
		  {upper: 80000, rate: 0.35},
		  {upper: Infinity, rate: 0.45}
	    ],
	TAX_LOWER_BOUND = 3500;

function CalculatorCtrl($scope) {
  $scope.detailsShow = false;
  
  $scope.cities = [
	{
		name: '苏州2012',
		insurance: {
			items: [
				{name: '养老', rate: 0.08},
				{name: '医疗', rate: 0.02},
				{name: '工伤', rate: 0.00},
				{name: '生育', rate: 0.00},
				{name: '失业', rate: 0.01}
			],
			upper: 12915,
			lower: 2010
		},
		houseFunding: {
			name: '公积金', 
			rate: 0.10,
			upper: 13600,
			lower: 1370
		}
	},
	{
		name: '苏州2013',
		insurance: {
			items: [
				{name: '养老', rate: 0.08},
				{name: '医疗', rate: 0.02},
				{name: '工伤', rate: 0.00},
				{name: '生育', rate: 0.00},
				{name: '失业', rate: 0.01}
			],
			upper: 14407,
			lower: 2010
		},
		houseFunding: {
			name: '公积金', 
			rate: 0.10,
			upper: 15400,
			lower: 1370
		}
	},
	{
		name: '杭州',
		insurance: {
			items: [
				{name: '养老', rate: 0.08},
				{name: '医疗', rate: 0.02},
				{name: '工伤', rate: 0.00},
				{name: '生育', rate: 0.00},
				{name: '失业', rate: 0.01}
			],
			upper: 10050,
			lower: 2010
		},
		houseFunding: {
			name: '公积金', 
			rate: 0.12,
			upper: 14104,
			lower: 1470
		}
	}
  ];
  
  $scope.city = $scope.cities[0];
  
  $scope.insurance = $scope.city.insurance;
  
  $scope.houseFunding = $scope.city.houseFunding;
  
  $scope.cityChange = function(){
	$scope.insurance = $scope.city.insurance;
    $scope.houseFunding = $scope.city.houseFunding;
	this.reset();
  }
  
  $scope.getInsuranceRate = function(){
	var rate = 0; 
	angular.forEach(this.insurance.items, function(i){
		rate += i.rate;
	});
	
	return rate;
  }
  
  getBounded = function(amount, upper, lower){
	if (amount < lower){
		return 0;
	}else if (amount > upper){
		return upper;
	}else {
		return amount;
	}
  }
  
  $scope.getInsurance = function(amount){
	if (amount > 0){
		var i, 
			total = 0, 
			insurance = this.insurance, 
			insuranceBase = getBounded(amount, insurance.upper, insurance.lower);
		for (i = 0; i < insurance.items.length; i++){
			total += insurance.items[i].rate * insuranceBase;
		}
		return total;
	}else{
		return 0;
	}
  }
  
  $scope.getHouseFunding = function(amount){
	if (amount > 0){
		var f = this.houseFunding;
		return getBounded(amount, f.upper, f.lower) * f.rate;
	}else{
		return 0;
	}
  }
  
  $scope.getBonusTaxRate = function(annualBonus){
		if (annualBonus > 0){
			var monthly = annualBonus / 12, i;
				
			for (i = 0; i < TAX_LEVELS.length; i++){
				if (monthly <= TAX_LEVELS[i].upper){
					return TAX_LEVELS[i].rate;
				}
			}
		}else{
			return 0;
		}
	};
  
  $scope.getTax = function(amount){	
	if (amount){
	    var levels = TAX_LEVELS,
		  base = TAX_LOWER_BOUND,
		  taxable = amount - base, i, tax = 0, levelTaxable, lower = 0;
	    
	    for (i = 0; i < levels.length && taxable > 0; i++){
		  levelTaxable = Math.min(taxable, levels[i].upper - lower);
		  tax += levelTaxable * levels[i].rate;
		  taxable -= levelTaxable;
		  lower = levels[i].upper;
	    }
	    return tax.toFixed(2);
	}else{
		return 0;
	}
  }
  
  $scope.getBonusTax = function(bonus, afterInsurance){
	if (bonus >= 0 && afterInsurance >= 0) {
		var rate = this.getBonusTaxRate(bonus),
			taxable = bonus - Math.max(0, TAX_LOWER_BOUND - afterInsurance);
		
		return taxable * rate;
	}else {
		return 0;
	}
  }
  
  $scope.doCalculate = function(){
	var pay = this.amount = parseInt(this.amount, 10) || 0,
		bonus = this.bonus = parseInt(this.bonus, 10) || 0;
	
	this.boundedInsurance = getBounded(pay, this.insurance.upper, this.insurance.lower);
	this.paidInsurance = this.getInsurance(pay);
	this.boundedHouseFunding = getBounded(pay, this.houseFunding.upper, this.houseFunding.lower);
	this.paidHouseFunding = this.getHouseFunding(pay);
	this.paidTax = this.getTax(pay - this.paidInsurance - this.paidHouseFunding);
	this.bonusTax = this.getBonusTax(bonus, pay - this.paidInsurance - this.paidHouseFunding);
	this.actualPay = pay - this.paidInsurance - this.paidHouseFunding - this.paidTax + bonus - this.bonusTax;
  }
  
  $scope.reset = function(){
	this.boundedInsurance = this.insurance.lower + ' ~ ' + this.insurance.upper;
	this.boundedHouseFunding = this.houseFunding.lower + ' ~ ' + this.houseFunding.upper;
	this.paidInsurance = this.paidHouseFunding = this.paidTax = this.bonusTax = 0;
  }
  
  $scope.reset();
}