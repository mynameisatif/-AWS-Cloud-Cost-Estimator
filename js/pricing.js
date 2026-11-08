
/*
=================================================
 CLOUDCOST - AWS PRICING CONFIGURATION
=================================================

Purpose:
Store illustrative AWS pricing assumptions.

Region: US East (N. Virginia)
Currency: USD
Hours per month: 730

These are demonstration rates, not live AWS quotes.
=================================================
*/

const AWS_PRICING = {

    region: "us-east-1",

    currency: "USD",

    hoursPerMonth: 730,

    
regions: {
    "us-east-1": {
        name: "US East (N. Virginia)",
        multiplier: 1.00
    },
    "ap-south-1": {
        name: "Asia Pacific (Mumbai)",
        multiplier: 1.08
    },
    "ap-southeast-1": {
        name: "Asia Pacific (Singapore)",
        multiplier: 1.05
    },
    "eu-west-1": {
        name: "Europe (Ireland)",
        multiplier: 1.10
    }
},



    // =========================================
    // EC2 INSTANCE PRICING (PER HOUR)
    // =========================================

    ec2: {

        "t2.micro": {
            name: "t2.micro",
            vCPU: 1,
            memory: "1 GiB",
            hourlyRate: 0.0116
        },

        "t3.small": {
            name: "t3.small",
            vCPU: 2,
            memory: "2 GiB",
            hourlyRate: 0.0208
        },

        "t3.medium": {
            name: "t3.medium",
            vCPU: 2,
            memory: "4 GiB",
            hourlyRate: 0.0416
        },

        "m5.large": {
            name: "m5.large",
            vCPU: 2,
            memory: "8 GiB",
            hourlyRate: 0.096
        }

    },


    // =========================================
    // S3 STORAGE PRICING (PER GB / MONTH)
    // =========================================

    s3: {

        STANDARD: {
            name: "S3 Standard",
            pricePerGB: 0.023
        },

        STANDARD_IA: {
            name: "S3 Standard-IA",
            pricePerGB: 0.0125
        },

        GLACIER: {
            name: "S3 Glacier",
            pricePerGB: 0.004
        }

    },


    // =========================================
    // RDS INSTANCE PRICING (PER HOUR)
    // =========================================

    rds: {

        "db.t3.micro": {
            name: "db.t3.micro",
            hourlyRate: 0.017
        },

        "db.t3.small": {
            name: "db.t3.small",
            hourlyRate: 0.034
        },

        "db.t3.medium": {
            name: "db.t3.medium",
            hourlyRate: 0.068
        }

    },


    // =========================================
    // DATA TRANSFER PRICING
    // =========================================

    dataTransfer: {

        outboundRatePerGB: 0.09

    }

};
