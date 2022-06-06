// NOTE: we use fixed ids because on each service restart
// the `_id` is regenerated and no longer matches the one stored
// in the cookie session. Therefore, the app constantly fails.
const ids = [
  "6def8789-defb-4312-b6c8-27c70bfd588e",
  "1ffeedc2-8730-4bb1-b393-440f134525a4",
  "1de6d2b3-876c-4ee4-887a-0bfcc2196875",
  "69f35927-0550-4b4f-bc7a-50f63f601bae",
  "736cefc0-6709-4d6f-a353-611af72396b0",
  "81dcd2e7-315b-4c9b-b400-cd31d97470f2",
  "9377714c-f89b-46c0-bb91-7b717594b6f0",
  "ae8f0c42-7f19-4f8a-ae0b-e0a90b4f5e5e",
  "8951bf4c-ad4e-492f-9426-a074247ee90e",
  "2524ee55-c4b6-49b0-932c-0378aa076b3a",
  "9366140e-3608-420d-a0e6-f2c0b4149f22",
  "258321cd-ac5f-4b66-806b-4991ac318914",
  "11e2b569-525f-456f-9cd9-b3951d3bf86e",
  "24922faa-bf37-4167-a1f5-94a54c0c91c6",
  "379755ba-0bcf-4d50-9b34-7c830690d979",
  "00380b09-ff76-446c-8918-4bae545c0a21",
  "8185c623-630c-4981-9df5-62e61616560f",
  "918ba4ba-0e93-4993-8d30-4a31eab3c707",
  "600002c7-2c2e-4306-84c5-52507c572cbc",
  "5e68c768-8ffb-4fe0-b038-2fb268f95206",
  "96bc44f3-6199-4752-bce8-866be490063e",
  "b8849893-c2d4-47a6-ba0a-5fab914ad823",
  "cc95e6ca-2d06-40d5-838d-ffa1a84e6356",
  "d6f6d8fd-2bc5-4763-9d5a-f72bc377b341",
  "1300be66-793c-4b1b-8a6b-94105c4fca9f",
  "edc7150f-78de-4b24-93cb-d7efb681a3a9",
  "3d184476-a762-45fb-abf0-31dbbbf42e7a",
  "a2b3be7c-d95f-461d-90df-af4cf38c9212",
  "b1905b31-bb20-4c0f-8fb2-8d4ca6c560d0",
  "9575e162-b574-4800-aaa7-3b6807f8c8c5",
  "41b78d3c-f87b-429d-be8f-74420d29a53b",
  "bfade530-2af7-4c3e-9e2d-3738302428b0",
  "ac504e65-80bb-4f1f-9f53-d22c481738c0",
  "3e54af04-2779-4a3a-82b8-67ce1d309355",
  "3c7007b1-1fd5-40af-9317-4750a39031bd",
  "ef3e1ccd-c90c-4df0-95cd-48c96bb85fb4",
  "af92c0fd-c4a8-45ce-9369-2f6e86c9d54d",
  "59d27d44-1011-4f08-b60f-d3557b772341",
  "a06b7849-0282-43a1-8b19-801ff8e5f45e",
  "9ac6ef34-af92-4f72-a4d0-dc01d6d0cc6c",
];

const users = require("../../fixtures/users");
const clients = require("../../fixtures/clients");

module.exports = {
  users: users.map((user, index) => ((user._id = ids[index]), user)),
  clients: clients.map(
    (client, index) => ((client._id = ids[users.length + index]), client)
  ),
};
