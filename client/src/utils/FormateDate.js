
const FormateDate = (date, type) => {

    if(type === "toLocal") {
        return new Date(date).toLocaleDateString("en-US", {
            day:"numeric",
            month: "short"
        })
    }

    if(type === "convertToDays") {
        const today = new Date();
        const dueDate = new Date(date);

        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate - today;

        return Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );
    }

    if(type === "month") {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short"
        });
    }

    if(type === "day") {
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric"
        })
    }
}

export default FormateDate;