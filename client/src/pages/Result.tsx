import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../css/Result.css';
import logo from '../assets/form-header-logo.png';
import heartTot from '../assets/tim-khoe.png';
import heartCanChuY from '../assets/tim-can-chu-y.png';
import heartCoNguyCo from '../assets/tim-co-nguy-co.png';
import heaetYeu from '../assets/tim-yeu.png';


interface ResultData {
  bmi: string;
  aiResponse: string;
  userInput: {
    heartRate: string;
    age: string;
    gender: string;
    systolicBP: string;
    diastolicBP: string;
    weight: string;
    height: string;
  };
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data as ResultData | undefined;

  // Function to determine health level based on indicators
  const getHealthLevel = () => {
    if (!data) return null;

    const heartRate = parseInt(data.userInput.heartRate);
    const systolic = parseInt(data.userInput.systolicBP);
    const diastolic = parseInt(data.userInput.diastolicBP);
    const bmi = parseFloat(data.bmi);
    const age = parseInt(data.userInput.age);

    let riskScore = 0;

    // Heart rate risk (resting)
    if (heartRate < 60 || heartRate > 100) riskScore += 2;
    else if (heartRate > 90) riskScore += 1;

    // Blood pressure risk
    if (systolic >= 180 || diastolic >= 120) riskScore += 3; // Hypertension crisis
    else if (systolic >= 140 || diastolic >= 90) riskScore += 2; // Stage 2
    else if (systolic >= 130 || diastolic >= 80) riskScore += 1; // Stage 1

    // BMI risk
    if (bmi < 16 || bmi >= 35) riskScore += 2;
    else if (bmi < 18.5 || bmi >= 30) riskScore += 1;

    // Age factor (higher risk for older)
    if (age > 65) riskScore += 1;

    // Determine level
    if (riskScore >= 5) {
      return {
        level: 'high',
        title: 'CẤP ĐỘ ĐỎ — NGUY CƠ CAO',
        color: '#D92D20',
        image: heaetYeu
      };
    } else if (riskScore >= 3) {
      return {
        level: 'medium',
        title: 'CẤP ĐỘ CAM — NGUY CƠ TRUNG BÌNH',
        color: '#B54708',
        image: heartCoNguyCo
      };
    } else if (riskScore >= 1) {
      return {
        level: 'caution',
        title: 'CẤP ĐỘ VÀNG — CẦN CHÚ Ý NHẸ',
        color: '#F79009',
        image: heartCanChuY
      };
    } else {
      return {
        level: 'healthy',
        title: 'CẤP ĐỘ XANH LÁ — TÌNH TRẠNG TIM MẠCH ỔN ĐỊNH',
        color: '#039855',
        image: heartTot
      };
    }
  };

  // Function to analyze heart rate
  const analyzeHeartRate = () => {
    const heartRate = parseInt(data!.userInput.heartRate);
    
    if (heartRate < 60) {
      return { status: 'Nhịp tim chậm (Bradycardia)', color: '#F79009' };
    } else if (heartRate >= 60 && heartRate <= 80) {
      return { status: 'Nhịp tim bình thường - Tốt', color: '#039855' };
    } else if (heartRate > 80 && heartRate <= 100) {
      return { status: 'Nhịp tim bình thường - Hơi cao', color: '#F79009' };
    } else {
      return { status: 'Nhịp tim nhanh (Tachycardia)', color: '#D92D20' };
    }
  };

  // Function to analyze blood pressure
  const analyzeBloodPressure = () => {
    const systolic = parseInt(data!.userInput.systolicBP);
    const diastolic = parseInt(data!.userInput.diastolicBP);
    
    if (systolic >= 180 || diastolic >= 120) {
      return { status: 'Khẩn cấp tăng huyết áp', color: '#D92D20' };
    } else if (systolic >= 140 || diastolic >= 90) {
      return { status: 'Tăng huyết áp độ 2', color: '#D92D20' };
    } else if (systolic >= 130 || diastolic >= 80) {
      return { status: 'Tăng huyết áp độ 1', color: '#B54708' };
    } else if (systolic >= 120 || diastolic >= 80) {
      return { status: 'Huyết áp cao hơn bình thường', color: '#F79009' };
    } else if (systolic < 90 || diastolic < 60) {
      return { status: 'Huyết áp thấp', color: '#F79009' };
    } else {
      return { status: 'Huyết áp bình thường', color: '#039855' };
    }
  };

  // Function to analyze BMI
  const analyzeBMI = () => {
    const bmi = parseFloat(data!.bmi);
    
    if (bmi < 16) {
      return { status: 'Gầy mức độ III (Rất gầy)', color: '#D92D20' };
    } else if (bmi >= 16 && bmi < 17) {
      return { status: 'Gầy mức độ II', color: '#B54708' };
    } else if (bmi >= 17 && bmi < 18.5) {
      return { status: 'Gầy mức độ I (Thiếu cân)', color: '#F79009' };
    } else if (bmi >= 18.5 && bmi < 25) {
      return { status: 'Bình thường', color: '#039855' };
    } else if (bmi >= 25 && bmi < 30) {
      return { status: 'Thừa cân', color: '#F79009' };
    } else if (bmi >= 30 && bmi < 35) {
      return { status: 'Béo phì độ I', color: '#B54708' };
    } else {
      return { status: 'Béo phì độ II (Rất béo)', color: '#D92D20' };
    }
  };

  const healthLevel = getHealthLevel();
  const heartRateAnalysis = data ? analyzeHeartRate() : null;
  const bloodPressureAnalysis = data ? analyzeBloodPressure() : null;
  const bmiAnalysis = data ? analyzeBMI() : null;

  useEffect(() => {
    // Redirect to home if no data
    if (!data) {
      navigate('/home');
    } else {
      // Debug: log AI response
      console.log('AI Response:', data.aiResponse);
      console.log('AI Response type:', typeof data.aiResponse);
      console.log('Health Level:', healthLevel);
    }
  }, [data, navigate, healthLevel]);

  if (!data || !healthLevel) {
    return null;
  }

  return (
    <div className='container'>
      <section className='content result'>
        <div className="block1"></div>
        <div className="block4"></div>
        <div className='result-container'>
          <div className='result-content-header'>
            <img src={logo} alt="heart" />
            <p className='form-header-text'>Phân tích từng nhịp tim, hiểu sâu hơn về sức khỏe của bạn</p>
          </div>
          <div className='result-content-AI'>
            <div className='result-ai-content'>
              <p className='status-title' style={{ color: healthLevel.color }}>
                {healthLevel.title}
              </p>
              <div className="markdown-body">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({ ...props }) => <h3 style={{ color: '#19254f', marginTop: '0.75rem', fontSize: '0.95rem' }} {...props} />,
                    h2: ({ ...props }) => <h2 style={{ color: '#19254f', marginTop: '0.75rem', fontSize: '1.05rem' }} {...props} />,
                    strong: ({ ...props }) => <strong style={{ color: '#19254f', fontWeight: 600 }} {...props} />,
                    p: ({ ...props }) => <p style={{ marginBottom: '0.5rem', lineHeight: '1.6', fontSize: '0.9rem' }} {...props} />,
                    ul: ({ ...props }) => <ul style={{ marginLeft: '1rem', marginBottom: '0.5rem', fontSize: '0.9rem' }} {...props} />,
                    ol: ({ ...props }) => <ol style={{ marginLeft: '1rem', marginBottom: '0.5rem', fontSize: '0.9rem' }} {...props} />,
                    li: ({ ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />
                  }}
                >
                  {data.aiResponse}
                </Markdown>
              </div>
            </div>
            <div className='heart-status'>
              <img src={healthLevel.image} alt={`heart-${healthLevel.level}`} className='heart-img' />
            </div>
          </div>
          <div className='result-content-userinfo'>
            <h2 className='result-content-userinfo-title'>Phân tích từng chỉ số</h2>
            <table className='info-table'>
              <thead>
                <tr>
                  <th>Chỉ số</th>
                  <th>Giá trị</th>
                  <th>Ngưỡng chuẩn</th>
                  <th>Nhận xét</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Nhịp tim nghỉ</th>
                  <td>{data.userInput.heartRate} bpm</td>
                  <td>60 - 100 bpm</td>
                  <td style={{ color: heartRateAnalysis?.color, fontWeight: 500 }}>
                    {heartRateAnalysis?.status}
                  </td>
                </tr>
                <tr>
                  <th>Huyết áp</th>
                  <td>{data.userInput.systolicBP}/{data.userInput.diastolicBP} mmHg</td>
                  <td>&lt;120/80 mmHg</td>
                  <td style={{ color: bloodPressureAnalysis?.color, fontWeight: 500 }}>
                    {bloodPressureAnalysis?.status}
                  </td>
                </tr>
                <tr>
                  <th>BMI</th>
                  <td>{data.bmi}</td>
                  <td>18.5 - 24.9</td>
                  <td style={{ color: bmiAnalysis?.color, fontWeight: 500 }}>
                    {bmiAnalysis?.status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <div className='overlay'></div>
    </div>
  );
}

