 const fmt = (val) =>
    Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default fmt;