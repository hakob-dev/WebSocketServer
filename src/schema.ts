import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  name: 'Record',
  fields: [
    {
      name: 'randomId',
      type: 'int'
    },
    { name: 'title', type: 'string' }
  ]
});
