export default function GetStatusNameById (statusId) {
    let status;

    switch (statusId) {
        case 1: status = 'New';
                break;
        case 2: status = 'Develop'; // Develop play
                break;
        case 3: status = 'Develop'; // Develop stop
                break;
        case 4: status = 'Code Review'; // Code Review play
                break;
        case 5: status = 'Code Review'; // Code Review stop
                break;
        case 6: status = 'QA'; // QA play
                break;
        case 7: status = 'QA'; // QA stop
                break;
        case 8: status = 'Done';
                break;
        default: break;
    }
    return status;
}
