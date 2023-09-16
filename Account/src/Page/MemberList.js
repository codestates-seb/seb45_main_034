

function MemberList() {
    const [members, setMembers] = useState([]);
  
    const addCustomer = (customer) => {
      
      setMembers([...members, customer]);
    };
    
      };
    return (
        <div>
          <h1>회원 정보 조회</h1>
          <CustomerForm addCustomer={addCustomer} />
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member.name} - {member.email}</li>
            ))}
          </ul>
        </div>
        
      );
      
    
    export default MemberList