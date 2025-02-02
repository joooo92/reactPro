import { useEffect, useState } from 'react'
import '../adminMain/Admin.css'
import { Form, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

function UserInQuryWrite({ checkPermission }) {
    const [pro,setPro]=useState(false)
    const [ser,setSer]=useState(false)
    const [getProject,setProject]=useState();
    const [getServer,setServer]=useState();

    
    const [form, setForm] = useState({
        cs_title: '',
        cs_content: '',
        cs_answer_yn: 'N',
        cs_type: '',
        cs_project:'',
        cs_server:'',
        cs_writer: checkPermission.sub
    })
    const noticeChange = (e) => {
        
            const copy = { ...form, [e.target.name]: e.target.value }
            setForm(copy)

    }
    const noticeTypeChange=async(e)=>{
        if(e.target.value=="프로젝트 및 서버 관련"){
            const copy={...form,[e.target.name]:e.target.value}
            setForm(copy)
            const cus_id=checkPermission.sub
            const response=await axios.get(`/api/main/user/list/${cus_id}`)
            setProject(response.data)
            setPro(true)
        }else{
            const copy = { ...form, [e.target.name]: e.target.value }
            setForm(copy)
            setPro(false)
            setSer(false)
            setProject('')
            setServer('')
        }
    }
    const proChange=async(e)=>{
        if(e.target.value=="ALL"){
            const copy = { ...form, [e.target.name]: e.target.value }
            setForm(copy)
        }else{
            const copy = { ...form, [e.target.name]: e.target.value }
            setForm(copy)
            const pro_id=e.target.value;
            const response=await axios.get(`/api/main/user/getServerList?pro_id=${pro_id}`)
            setServer(response.data)
            setSer(true)
        }
    }
    const serChange=(e)=>{
        const copy = { ...form, [e.target.name]: e.target.value }
        setForm(copy)
    }
    const [fileUp, setFileUp] = useState({})
    const fileUpload = (e) => {
        const file = e.target.files[0];

        setFileUp(file)
    }
    
    const history = useNavigate();
    const submit = async () => {
        if (form.cs_title != '' & form.cs_content != ""&form.cs_type!="") {


            if (fileUp.name != undefined) {
                const fileName = fileUp.name;
                const validExtensions = ['txt', 'pdf'];
                const fileExtension = fileName.split('.').pop().toLowerCase();
                if (validExtensions.includes(fileExtension)) {

                    const AdminId = checkPermission.sub;
                    let formData = new FormData();
                    formData.append("file_data", fileUp);
                    formData.append("userId", AdminId);

                    await axios.post('/api/main/user/quryeWrite', form)
                    const response = await axios.post('/api/main/cloudUploadCs', formData)
                    if (response.data === '성공') {
                        alert('작성 완료 했습니다.')
                        history("/user/inQuryList")
                    } else {
                        alert('잘못된 접근 입니다.')
                    }

                } else {
                    alert('txt, pdf 파일만 업로드 가능합니다.');
                }

            } else {
                const response = await axios.post('/api/main/user/quryeWrite', form)
                if (response.data === '성공') {
                    alert('작성 완료 했습니다.')
                    history("/user/inQuryList")
                } else {
                    alert('잘못된 접근 입니다.')
                }
            }
        } else {
            alert('제목과 내용 또는 문의 종류를 입력해주세요')
        }

    }
    return (

        <>
            <div className="page-wrapper" >

                <div className="page-breadcrumb">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <h4 className="" style={{ padding: "40px 0 0 30px", fontWeight: 'bold', color: 'rgb(78, 89, 104)' }}>
                                    <Link style={{ margin: "0 15px 0 0" }} to="/admin/annoList" className="inq-back" >
                                        ← 문의 목록
                                    </Link><p>문의 사항</p></h4>
                                
                                <div className="card-body card-bsy">


                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-2sy">
                                                <div className="form-group mb-3">
                                                    <div style={{ textAlign: 'center;' }}>제목</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4sy">
                                                <div className="form-group mb-3">
                                                    <input type="text" onChange={noticeChange} name="cs_title" value={form.cs_title} valusclassName="form-control" placeholder="제목을 입력하세요" style={{width:'460px'}} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2sy">
                                                <div className="form-group mb-3">
                                                    <div style={{ textAlign: 'center;' }}>작성자명</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4sy">
                                                <div className="form-group mb-3">
                                                    <input type="text" className="form-control" placeholder={checkPermission.sub} readOnly />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-2sy">
                                                <div className="form-group mb-3">
                                                    <div style={{ textAlign: 'center;' }}>문의 종류</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4sy">
                                                <select onChange={noticeTypeChange} name="cs_type" value={form.cs_type} class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                                <option value="" selected disabled hidden>종류를 선택해주세요</option>
                                                    <option value="프로젝트 및 서버 관련">프로젝트 및 서버 관련</option>
                                                    <option value="기타" >기타 문의</option>
                                                </select>
                                               {pro?<select onChange={proChange} name="cs_project" value={form.cs_project} class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                               <option value="" selected disabled hidden>프로젝트를 선택해주세요</option>
                                               <option option value="ALL" > 프로젝트 전체</option>
                                                  {getProject.map((item,index)=>(
                                                    <option key={index} value={item.pro_id}>{item.pro_name}</option>
                                                  )) }

                                                </select>:null} 
                                               {ser?<select onChange={serChange} name="cs_server" value={form.cs_server} class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">
                                               <option value="" selected disabled hidden>서버를 선택해주세요</option>
                                                    <option value="ALL">서버 전체</option>
                                                    {getServer.map((item,index)=>(
                                                    <option key={index} value={item.eng_enid}>{item.server_name}</option>
                                                  )) }
                                                </select> :null} 

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2sy">
                                                <div className="form-group mb-3">
                                                    <div style={{ textAlign: 'center;' }}>문의내용</div>
                                                </div>
                                            </div>
                                            <div className="col-md-4sy">
                                                <div className="form-group mb-3">
                                                    <textarea className="form-control" onChange={noticeChange} name="cs_content" value={form.cs_content} placeholder="문의내용" style={{ height: '300px' }}></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-2sy">
                                                <div className="form-group mb-3">
                                                    <div style={{ textAlign: 'center;' }}>첨부파일

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4sy">
                                                <div className="form-group mb-3">
                                                    <input type='file' onChange={fileUpload} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row" style={{ width: '40%', margin: '0 auto' }}>
                                            <button style={{ background: "rgb(117, 116, 234)" }} type="submit" className="btn-writer" onClick={submit} >작성하기</button>
                                        </div>





                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default UserInQuryWrite