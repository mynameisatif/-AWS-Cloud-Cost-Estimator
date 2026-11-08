
/*
=================================================
 CLOUDCOST - COST CALCULATION ENGINE
=================================================

Responsibilities:
1. Calculate EC2 costs.
2. Calculate S3 costs.
3. Calculate RDS costs.
4. Calculate data transfer costs.
5. Calculate monthly and yearly totals.
6. Validate user inputs.

No DOM manipulation in this file.
=================================================
*/


// =============================================
// 1. INPUT VALIDATION
// =============================================

function validateNumber(value, fieldName, max = Infinity) {

    const number = Number(value);

    if (
        value === "" ||
        !Number.isFinite(number) ||
        number < 0 ||
        number > max
    ) {
        throw new Error(
            `Invalid value for ${fieldName}.`
        );
    }

    return number;
}


// =============================================
// 2. EC2 COST CALCULATION
// =============================================

function calculateEC2Cost(config) {

    const instance = AWS_PRICING.ec2[config.instance];

    if (!instance) {
        throw new Error("Invalid EC2 instance type.");
    }

    const count = validateNumber(
        config.count,
        "EC2 instance count",
        100
    );

    const hours = validateNumber(
        config.hours,
        "EC2 running hours",
        AWS_PRICING.hoursPerMonth
    );

    if (!Number.isInteger(count)) {
        throw new Error("EC2 instance count must be a whole number.");
    }

    const totalCost =
        instance.hourlyRate * count * hours;

    return totalCost;
}


// =============================================
// 3. S3 COST CALCULATION
// =============================================

function calculateS3Cost(config) {

    const storageClass =
        AWS_PRICING.s3[config.storageClass];

    if (!storageClass) {
        throw new Error("Invalid S3 storage class.");
    }

    const storageGB = validateNumber(
        config.storageGB,
        "S3 storage amount"
    );

    const totalCost =
        storageClass.pricePerGB * storageGB;

    return totalCost;
}


// =============================================
// 4. RDS COST CALCULATION
// =============================================

function calculateRDSCost(config) {

    const instance = AWS_PRICING.rds[config.instance];

    if (!instance) {
        throw new Error("Invalid RDS instance type.");
    }

    const hours = validateNumber(
        config.hours,
        "RDS running hours",
        AWS_PRICING.hoursPerMonth
    );

    const totalCost =
        instance.hourlyRate * hours;

    return totalCost;
}


// =============================================
// 5. DATA TRANSFER CALCULATION
// =============================================

function calculateTransferCost(config) {

    const dataGB = validateNumber(
        config.dataGB,
        "Data transfer amount"
    );

    const rate = validateNumber(
        config.rate,
        "Data transfer rate"
    );

    const totalCost = dataGB * rate;

    return totalCost;
}


// =============================================
// 6. TOTAL COST CALCULATION
// =============================================

function calculateTotalCost(config) {

    const costs = {

        ec2: config.ec2.enabled
            ? calculateEC2Cost(config.ec2)
            : 0,

        s3: config.s3.enabled
            ? calculateS3Cost(config.s3)
            : 0,

        rds: config.rds.enabled
            ? calculateRDSCost(config.rds)
            : 0,

        transfer: config.transfer.enabled
            ? calculateTransferCost(config.transfer)
            : 0

    };


    const monthlyTotal = Object.values(costs)
        .reduce((total, cost) => total + cost, 0);


    const yearlyTotal = monthlyTotal * 12;


    const activeServices = Object.values(config)
        .filter(
            value =>
                value &&
                typeof value === "object" &&
                value.enabled === true
        ).length;


    return {

        breakdown: costs,

        monthlyTotal,

        yearlyTotal,

        activeServices

    };

}
