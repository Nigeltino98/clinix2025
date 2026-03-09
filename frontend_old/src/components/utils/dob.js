export const min_date = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d.toISOString().split("T")[0];
}

  export const max_date = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3);
    return d.toISOString().split("T")[0];
}
