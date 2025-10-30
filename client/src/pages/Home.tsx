import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../css/WebCSS.css';
import logo from '../assets/form-header-logo.png';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    heartRate: '',
    age: '',
    gender: '',
    systolicBP: '',
    diastolicBP: '',
    weight: '',
    height: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          heartRate: formData.heartRate,
          age: formData.age,
          gender: formData.gender,
          systolicBP: formData.systolicBP,
          diastolicBP: formData.diastolicBP,
          weight: formData.weight,
          height: formData.height
        })
      });

      const result = await response.json();

      if (result.success) {
        // Navigate to Result page with data
        navigate('/result', { state: { data: result.data } });
      } else {
        alert('Có lỗi xảy ra: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <section className='content'>
        <div className="block1"></div>
        <div className="block2"></div>
        <div className="block3"></div>
        <div className='form-container'>
          <div className='form-header'>
            <img src={logo} alt="heart" />
            <p className='form-header-text'>Phân tích từng nhịp tim, hiểu sâu hơn về sức khỏe của bạn</p>
          </div>
          <form className='form-body' onSubmit={handleSubmit}>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor="heartRate" className='form-label'>Nhịp tim khi nghỉ<span className='label-unit'>/bpm</span></label>
                <input
                  type="text"
                  id="heartRate"
                  name="heartRate"
                  placeholder='Nhịp tim của bạn'
                  value={formData.heartRate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor="age" className='form-label'>Tuổi</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  placeholder='Số tuổi'
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor="gender" className='form-label'>Giới tính</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor="systolicBP" className='form-label'>Huyết áp tâm thu<span className='label-unit'>/mmHg</span></label>
                <input
                  type="text"
                  id="systolicBP"
                  name="systolicBP"
                  placeholder='Áp lực máu khi tim co bóp'
                  value={formData.systolicBP}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor="diastolicBP" className='form-label'>Huyết áp tâm trương<span className='label-unit'>/mmHg</span></label>
                <input
                  type="text"
                  id="diastolicBP"
                  name="diastolicBP"
                  placeholder='Áp lực máu khi tim giãn nở'
                  value={formData.diastolicBP}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor="weight" className='form-label'>Cân nặng<span className='label-unit'>/kg</span></label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  placeholder='Cân nặng của bạn'
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor="height" className='form-label'>Chiều cao<span className='label-unit'>/cm</span></label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  placeholder='Chiều cao của bạn'
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              <p className='btn-text'>{loading ? 'Đang phân tích...' : 'Kiểm tra'}</p>
            </button>
          </form>
        </div>
      </section>
      <div className='overlay'></div>
    </div>
  );
}
