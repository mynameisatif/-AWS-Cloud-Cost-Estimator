
document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------
    // 1. Get HTML elements
    // --------------------------------

    const elements = {
        monthlyTotal: document.getElementById("monthlyTotal"),
        yearlyTotal: document.getElementById("yearlyTotal"),
        serviceCount: document.getElementById("serviceCount"),
        chartTotal: document.getElementById("chartTotal"),
        costChart: document.getElementById("costChart"),
        resetButton: document.getElementById("resetButton"),

        ec2Cost: document.getElementById("ec2Cost"),
        s3Cost: document.getElementById("s3Cost"),
        rdsCost: document.getElementById("rdsCost"),
        transferCost: document.getElementById("transferCost"),

        ec2Legend: document.getElementById("ec2Legend"),
        s3Legend: document.getElementById("s3Legend"),
        rdsLegend: document.getElementById("rdsLegend"),
        transferLegend: document.getElementById("transferLegend")
    };

    // --------------------------------
    // 2. Currency formatting
    // --------------------------------

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: AWS_PRICING.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function formatCurrency(amount) {
        return currencyFormatter.format(amount);
    }

    // --------------------------------
    // 3. Read calculator inputs
    // --------------------------------

    function getConfiguration() {
        return {
            ec2: {
                enabled: document.getElementById("ec2Enabled").checked,
                instance: document.getElementById("ec2Instance").value,
                count: document.getElementById("ec2Count").value,
                hours: document.getElementById("ec2Hours").value
            },

            s3: {
                enabled: document.getElementById("s3Enabled").checked,
                storageClass: document.getElementById("s3StorageClass").value,
                storageGB: document.getElementById("s3Storage").value
            },

            rds: {
                enabled: document.getElementById("rdsEnabled").checked,
                instance: document.getElementById("rdsInstance").value,
                hours: document.getElementById("rdsHours").value
            },

            transfer: {
                enabled: document.getElementById("transferEnabled").checked,
                dataGB: document.getElementById("transferGB").value,
                rate: document.getElementById("transferRate").value
            }
        };
    }

    // --------------------------------
    // 4. Enable / disable service fields
    // --------------------------------

    function syncServiceFields() {
        const services = [
            { toggle: "ec2Enabled", fields: "ec2Fields" },
            { toggle: "s3Enabled", fields: "s3Fields" },
            { toggle: "rdsEnabled", fields: "rdsFields" },
            { toggle: "transferEnabled", fields: "transferFields" }
        ];

        services.forEach(service => {
            const toggle = document.getElementById(service.toggle);
            const container = document.getElementById(service.fields);

            const enabled = toggle.checked;

            container.querySelectorAll("input, select").forEach(input => {
                input.disabled = !enabled;
            });

            container.style.opacity = enabled ? "1" : "0.4";
        });
    }

    // --------------------------------
    // 5. Update dashboard values
    // --------------------------------

    function updateDashboard(result) {
        elements.monthlyTotal.textContent =
            formatCurrency(result.monthlyTotal);

        elements.yearlyTotal.textContent =
            formatCurrency(result.yearlyTotal);

        elements.serviceCount.textContent =
            result.activeServices;

        elements.chartTotal.textContent =
            formatCurrency(result.monthlyTotal);

        elements.ec2Cost.textContent =
            formatCurrency(result.breakdown.ec2);

        elements.s3Cost.textContent =
            formatCurrency(result.breakdown.s3);

        elements.rdsCost.textContent =
            formatCurrency(result.breakdown.rds);

        elements.transferCost.textContent =
            formatCurrency(result.breakdown.transfer);

        elements.ec2Legend.textContent =
            formatCurrency(result.breakdown.ec2);

        elements.s3Legend.textContent =
            formatCurrency(result.breakdown.s3);

        elements.rdsLegend.textContent =
            formatCurrency(result.breakdown.rds);

        elements.transferLegend.textContent =
            formatCurrency(result.breakdown.transfer);

        drawChart(result.breakdown, result.monthlyTotal);

        // Update service percentage breakdown
const services = [
    { key: "ec2", percentage: "ec2Percentage", progress: "ec2Progress" },
    { key: "s3", percentage: "s3Percentage", progress: "s3Progress" },
    { key: "rds", percentage: "rdsPercentage", progress: "rdsProgress" },
    { key: "transfer", percentage: "transferPercentage", progress: "transferProgress" }
];

services.forEach(service => {
    const value = result.breakdown[service.key];

    const percentage = result.monthlyTotal > 0
        ? (value / result.monthlyTotal) * 100
        : 0;

    document.getElementById(service.percentage).textContent =
        `${percentage.toFixed(1)}%`;

    document.getElementById(service.progress).style.width =
        `${percentage}%`;
});
    }

    // --------------------------------
    // 6. Draw donut chart
    // --------------------------------

    function drawChart(breakdown, total) {
        const canvas = elements.costChart;

        if (!canvas) return;

        const context = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;

        context.scale(pixelRatio, pixelRatio);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = Math.min(rect.width, rect.height) * 0.38;
        const lineWidth = Math.min(rect.width, rect.height) * 0.19;

        context.clearRect(0, 0, rect.width, rect.height);

        // Chart background ring
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.strokeStyle = "#e8edf2";
        context.lineWidth = lineWidth;
        context.stroke();

        if (total <= 0) return;

        const segments = [
            { value: breakdown.ec2, color: "#f39a3d" },
            { value: breakdown.s3, color: "#5d9bd8" },
            { value: breakdown.rds, color: "#9875d6" },
            { value: breakdown.transfer, color: "#46b58e" }
        ];

        let startAngle = -Math.PI / 2;

        segments.forEach(segment => {
            if (segment.value <= 0) return;

            const angle = (segment.value / total) * Math.PI * 2;
            const endAngle = startAngle + angle;

            context.beginPath();
            context.arc(
                centerX,
                centerY,
                radius,
                startAngle,
                endAngle
            );

            context.strokeStyle = segment.color;
            context.lineWidth = lineWidth;
            context.lineCap = "butt";
            context.stroke();

            startAngle = endAngle;
        });
    }
    



    // --------------------------------
    // 7. Calculate everything
    // --------------------------------

    const errorBox = document.createElement("div");
    errorBox.className = "calculation-error";
    errorBox.setAttribute("role", "alert");
    errorBox.hidden = true;

    const calculatorPanel = document.querySelector(".calculator-panel");

    if (calculatorPanel) {
        calculatorPanel.prepend(errorBox);
    }

    
function calculateAndRender() {
    try {
        const config = getConfiguration();

        // Calculate the base estimate
        const result = calculateTotalCost(config);

        // Read selected AWS region
        const selectedRegion =
            document.getElementById("regionSelect").value;

        const region = AWS_PRICING.regions[selectedRegion];

        if (!region) {
            throw new Error("Please select a valid AWS region.");
        }

        // Apply illustrative regional multiplier
        Object.keys(result.breakdown).forEach(service => {
            result.breakdown[service] *= region.multiplier;
        });

        // Recalculate totals after regional adjustment
        result.monthlyTotal = Object.values(result.breakdown)
            .reduce((sum, cost) => sum + cost, 0);

        result.yearlyTotal = result.monthlyTotal * 12;

        errorBox.hidden = true;
        errorBox.textContent = "";

        updateDashboard(result);

    } catch (error) {
        errorBox.hidden = false;
        errorBox.textContent = error.message;

        console.error("Calculation error:", error);
    }
}


    // --------------------------------
    // 8. Listen for input changes
    // --------------------------------

    const inputElements = document.querySelectorAll(
        ".calculator-panel input, .calculator-panel select"
    );

    inputElements.forEach(input => {
        input.addEventListener("input", () => {
            syncServiceFields();
            calculateAndRender();
        });

        input.addEventListener("change", () => {
            syncServiceFields();
            calculateAndRender();
        });
    });

    // --------------------------------
    // 9. Reset calculator
    // --------------------------------

    function resetCalculator() {
        document.getElementById("ec2Enabled").checked = true;
        document.getElementById("ec2Instance").value = "t2.micro";
        document.getElementById("ec2Count").value = 1;
        document.getElementById("ec2Hours").value = 730;

        document.getElementById("s3Enabled").checked = true;
        document.getElementById("s3StorageClass").value = "STANDARD";
        document.getElementById("s3Storage").value = 100;

        document.getElementById("rdsEnabled").checked = false;
        document.getElementById("rdsInstance").value = "db.t3.micro";
        document.getElementById("rdsHours").value = 730;

        document.getElementById("transferEnabled").checked = true;
        document.getElementById("transferGB").value = 50;
        document.getElementById("transferRate").value = 0.09;

        errorBox.hidden = true;
        errorBox.textContent = "";

        syncServiceFields();
        calculateAndRender();
    }

    elements.resetButton.addEventListener("click", resetCalculator);

    // --------------------------------
    // 10. Initial dashboard setup
    // --------------------------------

    syncServiceFields();
    calculateAndRender();

    window.addEventListener("resize", calculateAndRender);

    
// --------------------------------
// CSV Export
// --------------------------------

function exportCostCSV() {
    try {
        const config = getConfiguration();
        const result = calculateTotalCost(config);

        const regionCode =
            document.getElementById("regionSelect").value;

        const region = AWS_PRICING.regions[regionCode];

        if (!region) {
            throw new Error("Invalid AWS region selected.");
        }

        const rows = [
            ["AWS Cloud Cost Estimator"],
            ["Region", region.name],
            ["Pricing note", "Illustrative estimates, not live AWS prices"],
            [],
            ["Service", "Monthly Cost (USD)", "Percentage"]
        ];

        const services = [
            ["Amazon EC2", "ec2"],
            ["Amazon S3", "s3"],
            ["Amazon RDS", "rds"],
            ["Data Transfer", "transfer"]
        ];

        services.forEach(([name, key]) => {
            const monthlyCost =
                result.breakdown[key] * region.multiplier;

            const percentage = result.monthlyTotal > 0
                ? (monthlyCost / (result.monthlyTotal * region.multiplier)) * 100
                : 0;

            rows.push([
                name,
                monthlyCost.toFixed(2),
                `${percentage.toFixed(1)}%`
            ]);
        });

        const regionalTotal =
            result.monthlyTotal * region.multiplier;

        rows.push([]);
        rows.push(["Total Monthly Cost", regionalTotal.toFixed(2)]);
        rows.push(["Estimated Yearly Cost", (regionalTotal * 12).toFixed(2)]);

        const csvContent = rows.map(row =>
            row.map(value => {
                const safeValue = String(value ?? "");
                return `"${safeValue.replace(/"/g, '""')}"`;
            }).join(",")
        ).join("\r\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "aws-cloud-cost-estimate.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("exportCSV").addEventListener(
    "click",
    exportCostCSV
);

});
