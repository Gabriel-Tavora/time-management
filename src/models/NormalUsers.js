class NormalUser {
  constructor(data) {

    this.id = data.id;
    this.name = data.name;
    this.displayName = data.displayName;
    this.email = data.email;
    this.phone = data.phone;
    this.cpf = data.cpf;
    this.typeId = data.typeId;
    
  }
}

export default NormalUser;