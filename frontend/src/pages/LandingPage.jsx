import React from 'react';
import Card from '../components/Card.jsx';

function LandingPage() {
    return(
        <div>
            <Card
                jobTitle="UI/UX Designer"
                companyName="Creative Minds Inc."
                location="Sta Mesa, Manila"
                matchScore={92}
                workSetup="Hybrid"
                employmentType="Part-Time"
                description="Design and optimize user interfaces for client projects using Figma and other tools."
                salaryRangeLow={35}
                salaryRangeHigh={45}                
                />
         </div>
       
    );


}

export default LandingPage;