import Validator from 'fastest-validator';

const validate = (schema:object, payload: object)=>{
    const v = new Validator();
    const process = v.compile(schema);
    return process(payload)

};

export { validate };