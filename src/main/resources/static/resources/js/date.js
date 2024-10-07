function parseNIC(nic) {
    let birthYear, gender, daysCount;

    if (nic.length === 10) {
        birthYear = "19" + nic.substring(0, 2);
        daysCount = parseInt(nic.substring(2, 5));
    } else if (nic.length === 12) {
        birthYear = nic.substring(0, 4);
        daysCount = parseInt(nic.substring(4, 7));
    } else {
        throw new Error("Invalid NIC number format");
    }

    if (daysCount > 500) {
        gender = "Female";
        daysCount -= 500;
    } else {
        gender = "Male";
    }

    const birthDate = new Date(birthYear, 0, daysCount);

    const month = birthDate.getMonth() + 1;
    const date = birthDate.getDate();

    return {
        birthYear: birthYear,
        gender: gender,
        birthMonth: month,
        birthDate: date
    };
}

const nic = "200429002609";
const details = parseNIC(nic);

console.log("Birth Year:", details.birthYear); // 2004
console.log("Gender:", details.gender); // Male
console.log("Birth Month:", details.birthMonth); // 10 (October)
console.log("Birth Date:", details.birthDate); // 16



//db query
// SELECT sum(phb.quantity),sum(phb.quantity*b.saleprice),sd.name,date(p.addeddatetime) FROM suwasetha_clinic.batch as b,purchasedrug as pd,salesdrug as sd,payment_has_batch as phb,payment as p where b.id=phb.batch_id and b.purchasedrug_id=pd.id
// and pd.salesdrug_id=sd.id and p.id=phb.payment_id and p.addeddatetime between '2024-07-30' and '2024-08-12' group by date(p.addeddatetime),sd.name